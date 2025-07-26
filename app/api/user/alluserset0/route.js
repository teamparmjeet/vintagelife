import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { dscodes } = body; // Expecting an array of dscode strings

        if (!Array.isArray(dscodes) || dscodes.length === 0) {
            return NextResponse.json({
                message: "No dscodes provided",
                success: false
            }, { status: 400 });
        }

        const result = await UserModel.updateMany(
            { dscode: { $in: dscodes } },
            {
                $set: {
                    usertype: "1",
                    activesp: "100",
                    activedate: new Date()
                }
            }
        );

        return NextResponse.json({
            message: "Users updated successfully",
            success: true,
            modifiedCount: result.modifiedCount
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            message: "Error updating users",
            success: false
        }, { status: 500 });
    }
}
