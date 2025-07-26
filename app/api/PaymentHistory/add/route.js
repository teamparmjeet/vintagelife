import dbConnect from "@/lib/dbConnect";
import PaymentHistoryModel from "@/model/PaymentHistory";
import UserModel from "@/model/User";

export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json();

    // Step 1: Find the user by dscode (dsid from frontend)
    const user = await UserModel.findOne({ dscode: data.dsid });

    if (!user) {
      return Response.json(
        {
          message: "User not found for provided dsid",
          success: false,
        },
        { status: 404 }
      );
    }

    // Step 2: Set the dsgroup from user's group
    data.dsgroup = user.group;

    // Step 3: Save the payment history with the dsgroup included
    const newPaymentHistory = new PaymentHistoryModel(data);
    await newPaymentHistory.save();

    return Response.json(
      {
        message: "PaymentHistory created successfully",
        success: true,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("POST /payment-history error:", error);
    return Response.json(
      {
        message: "Error processing payment history",
        success: false,
      },
      { status: 500 }
    );
  }
}
