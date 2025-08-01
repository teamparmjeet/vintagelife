import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request, { params }) {
    await dbConnect();

    try {
        const { dscode } = params;
        const user = await UserModel.findOne({ dscode: dscode });
     

        if (!user) {
            return Response.json(
                {
                    message: "User not found!",
                    success: false,
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                name: user.name,
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error on getting user:", error);
        return Response.json(
            {
                message: "Error on getting user!",
                success: false,
            },
            { status: 500 }
        );
    }
}
