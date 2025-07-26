import dbConnect from "@/lib/dbConnect";
import DashboardimageModel from "@/model/dashboardimage";

export const GET = async (request) => {
    await dbConnect();

    try {
        const data = await DashboardimageModel.find({ defaultdata: "Dashboardimage" }).select("image -_id");

        return Response.json(
            {
                message: "Image URLs fetched successfully!",
                success: true,
                data,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error fetching image URLs:", error);
        return Response.json(
            {
                message: "Error fetching image URLs!",
                success: false,
            },
            { status: 500 }
        );
    }
};
