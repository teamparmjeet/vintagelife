import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * Handles PATCH requests to change a user's password.
 * This is a secure endpoint that requires authentication.
 */
export async function PATCH(req) {
  // Establish a database connection.
  await dbConnect();

  // Get the server-side session to identify the authenticated user.
  // This is more secure than relying on an ID from the client.
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated. Please log in." },
      { status: 401 }
    );
  }

  try {
    const { oldPassword, newPassword } = await req.json();
    const userId = session.user.id; // Get user ID from the secure session.

    // --- Input Validation ---
    if (!oldPassword || !newPassword) {
      return Response.json(
        { success: false, message: "Old and new passwords are required." },
        { status: 400 }
      );
    }

    // Find the user in the database.
    const user = await UserModel.findById(userId);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found!" },
        { status: 404 }
      );
    }

    // --- Security Check: Verify the old password is correct ---
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return Response.json(
        { success: false, message: "Incorrect old password. Please try again." },
        { status: 403 } // 403 Forbidden is appropriate here.
      );
    }

    // Hash the new password before saving it.
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's document with the new hashed password.
    await UserModel.updateOne(
      { _id: userId },
      { $set: { password: hashedNewPassword ,  plainpassword: newPassword, } }
    );

    return Response.json(
      { success: true, message: "Password updated successfully!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Password change error:", error);
    return Response.json(
      { success: false, message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
