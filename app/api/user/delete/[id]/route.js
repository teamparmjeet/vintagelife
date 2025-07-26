import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server"; // ✅ Import this

export async function DELETE(req, { params }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedUser = await UserModel.findOneAndDelete({ email: id });

        if (!deletedUser) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        return NextResponse.json({
            message: "User deleted successfully",
            success: true
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            message: "Error deleting user",
            success: false
        }, { status: 500 });
    }
}
