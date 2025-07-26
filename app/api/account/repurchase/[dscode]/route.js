// /api/account/repurchase/[dscode]/route.js
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Order";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { dscode } = params;
    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

    if (!dscode) {
      return NextResponse.json({ message: "Missing dscode" }, { status: 400 });
    }

    const user = await UserModel.findOne({ dscode });

    if (!user || !user.activedate) {
      return NextResponse.json({ message: "User or activation date not found" }, { status: 404 });
    }

    const activedate = new Date(user.activedate);

    const filter = {
      dscode,
      status: true,
      createdAt: { $gt: activedate },
    };

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      if (fromDate > activedate) {
        filter.createdAt.$gte = fromDate;
      }
    }

  if (dateTo) {
  const toDate = new Date(dateTo);
  // Set to end of day (23:59:59.999)
  toDate.setHours(23, 59, 59, 999);
  filter.createdAt.$lte = toDate;
}

    const orders = await OrderModel.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
