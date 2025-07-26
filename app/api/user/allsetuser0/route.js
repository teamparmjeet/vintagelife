import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();

    try {
        // Set usertype, saosp, and sgosp to "0" for all users
        const result = await UserModel.updateMany(
            {}, // No filter — applies to all users
            {
                $set: {
                    usertype: "0",
                    saosp: "0",
                    sgosp: "0"
                }
            }
        );

        return NextResponse.json({
            message: "All users reset successfully",
            success: true,
            modifiedCount: result.modifiedCount
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Error resetting users",
            success: false
        }, { status: 500 });
    }
}
