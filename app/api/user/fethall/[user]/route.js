import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
export const GET = async (request) => {
    await dbConnect();

    try {
        const data = await UserModel.find({
            defaultdata: { $in: ["freeze", "user", "block"] },
            usertype: { $ne: 2 },
        });


        return Response.json(
            {
                message: "All Data fetched successfully!",
                success: true,
                data,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error fetching ", error);
        return Response.json(
            {
                message: "Error fetching ",
                success: false,
            },
            { status: 500 }
        );
    }
};
