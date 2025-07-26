import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function PATCH(req) {
    await dbConnect();

    try {
        const data = await req.json();

        if (!data.id) {
            return new Response(
                JSON.stringify({ success: false, message: "User ID is required!" }),
                { status: 400 }
            );
        }

        const user = await UserModel.findById(data.id);
        if (!user) {
            return new Response(
                JSON.stringify({ success: false, message: "User not found!" }),
                { status: 404 }
            );
        }

        if (data.usertype === "1") {
            data.activedate = new Date();
            data.saosp = "0";
            data.sgosp = "0";

        }

        if (data.password && data.password !== user.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        if (data.level) {
            data.LevelDetails = [
                ...(user.LevelDetails || []),
                {
                    levelName: data.level,
                    sao: user.saosp || "",
                    sgo: user.sgosp || "",
                },
            ];
        }

        await UserModel.updateOne({ _id: data.id }, { $set: data });

        return new Response(
            JSON.stringify({ success: true, message: "Updated successfully!" }),
            { status: 200 }
        );

    } catch (error) {
        console.error("User update error:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Internal server error. Try again later." }),
            { status: 500 }
        );
    }
}
