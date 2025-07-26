// /api/cart/deleteByDscode/route.js or /api/cart/[dscode]/route.js depending on your route structure

import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/Cart";

export async function DELETE(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const dscode = searchParams.get("dscode");

  if (!dscode) {
    return Response.json({ message: "DSCode is required", success: false }, { status: 400 });
  }

  try {
    const result = await CartModel.deleteMany({ dscode });

    return Response.json(
      {
        message: `${result.deletedCount} cart item(s) deleted for dscode: ${dscode}`,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error deleting cart items", success: false },
      { status: 500 }
    );
  }
}
