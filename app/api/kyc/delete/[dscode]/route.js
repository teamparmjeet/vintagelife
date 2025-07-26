import dbConnect from "@/lib/dbConnect";
import KycModel from "@/model/KycStatus";

export async function DELETE(req, { params }) {
    await dbConnect();

    try {
        const { dscode } = params;

        if (!dscode) {
            return Response.json({ message: "dscode is required", success: false }, { status: 200 });
        }

        const deleted = await KycModel.findOneAndDelete({ dscode });

        if (!deleted) {
            return Response.json({ message: "KYC not found", success: false }, { status: 200 });
        }

        return Response.json({ message: "KYC deleted successfully", success: true }, { status: 200 });
    } catch (error) {
        console.error("KYC Delete API Error:", error);
        return Response.json({ message: "Error deleting KYC", success: false }, { status: 500 });
    }
}
