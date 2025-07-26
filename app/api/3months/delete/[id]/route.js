import dbConnect from "@/lib/dbConnect";
import MonthsModel from "@/model/3monthsboonanza";

export async function DELETE(req, { params }) {
    await dbConnect();

    try {
        const { id } = params;

        const deleteddata = await MonthsModel.findByIdAndDelete(id);

        if (!deleteddata) {
            return Response.json({
                message: "data not found",
                success: false
            }, { status: 404 });
        }

        return Response.json({
            message: "data deleted successfully",
            success: true
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({
            message: "Error deleting data",
            success: false
        }, { status: 500 });
    }
}
