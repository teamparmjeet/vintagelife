import dbConnect from "@/lib/dbConnect";
import KycModel from "@/model/KycStatus";

export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { dscode } = body;

        // Optional: check for duplicates
        const existing = await KycModel.findOne({ dscode });
        if (existing) {
            return Response.json({ message: "KYC already exists", success: true }, { status: 200 });
        }

        const newdata = new KycModel({ dscode });
        await newdata.save();

        return Response.json({ message: "KYC registered", success: true }, { status: 200 });
    } catch (error) {
        console.error("KYC API Error:", error);
        return Response.json({ message: "Error in KYC registration", success: false }, { status: 500 });
    }
}
