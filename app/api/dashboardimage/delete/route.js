import dbConnect from "@/lib/dbConnect";
import DashboardimageModel from "@/model/dashboardimage";

export const DELETE = async (req) => {
    await dbConnect();
    
    try {
        const { image } = await req.json(); 
        if (!image) {
            return Response.json({ message: "Image URL is required", success: false }, { status: 400 });
        }

        const result = await DashboardimageModel.findOneAndDelete({ image });
        if (!result) {
            return Response.json({ message: "Image not found", success: false }, { status: 404 });
        }

        return Response.json({ message: "Image deleted successfully!", success: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting image:", error);
        return Response.json({ message: "Error deleting image!", success: false }, { status: 500 });
    }
};
