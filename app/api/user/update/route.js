import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function PATCH(req) {
  await dbConnect();

  try {
    const data = await req.json();

    if (!data.id) {
      return Response.json({ success: false, message: "User ID is required!" }, { status: 400 });
    }

    const user = await UserModel.findById(data.id);
    if (!user) {
      return Response.json({ success: false, message: "User not found!" }, { status: 404 });
    }
    if (data.usertype === "1") {
      data.activedate = new Date();  // Add the current date
    }
    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await UserModel.updateOne({ _id: data.id }, { $set: data });

    return Response.json({ success: true, message: "User updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("User update error:", error);
    return Response.json(
      { success: false, message: "Internal server error. Try again later." },
      { status: 500 }
    );
  }
}
