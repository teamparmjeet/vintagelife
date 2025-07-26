import dbConnect from "@/lib/dbConnect";
import KycModel from "@/model/KycStatus";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const page = parseInt(body.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const dscodeSearch = body.dscode?.trim();

    // Step 1: Build query
    const query = { bankkyc: true };
    if (dscodeSearch) {
      query.dscode = { $regex: new RegExp(dscodeSearch, "i") };
    }

    // Step 2: Get KYC entries
    const kycs = await KycModel.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const dscodes = kycs.map((k) => k.dscode);

    // Step 3: Get users for those dscodes
    const users = await UserModel.find({ dscode: { $in: dscodes } });

    // Step 4: Total count
    const total = await KycModel.countDocuments(query);

    return NextResponse.json({
      message: "Users with approved bank KYC fetched",
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    console.error("KYC fetch error:", error);
    return NextResponse.json(
      { message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
}
