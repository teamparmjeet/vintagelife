import dbConnect from "@/lib/dbConnect";
import KycModel from "@/model/KycStatus";

export async function PATCH(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { dscode, ...updateData } = body;

        if (!dscode) {
            return Response.json({ message: "dscode is required", success: false }, { status: 400 });
        }

        // Find and update KYC by dscode
        const updatedKyc = await KycModel.findOneAndUpdate(
            { dscode },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedKyc) {
            return Response.json({ message: "KYC not found", success: false }, { status: 404 });
        }

        return Response.json({ message: "KYC updated", success: true, data: updatedKyc }, { status: 200 });
    } catch (error) {
        console.error("KYC Update API Error:", error);
        return Response.json({ message: "Error updating KYC", success: false }, { status: 500 });
    }
}
