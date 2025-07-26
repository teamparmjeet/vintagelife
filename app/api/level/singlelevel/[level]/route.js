import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { level } = params;  // Get level from dynamic route

    const users = await UserModel.find({ level });

    return new Response(
      JSON.stringify({ success: true, data: users }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching users by level:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
}
