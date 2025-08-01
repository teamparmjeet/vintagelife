import dbConnect from "@/lib/dbConnect";
import PaymentHistoryModel from "@/model/PaymentHistory";
import UserModel from "@/model/User";

export async function GET(req, { params }) {
    await dbConnect();
    const { dscode } = params;

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    try {
        const user = await UserModel.findOne({ dscode }).lean();

        if (!user || !user.activedate) {
            return Response.json({ success: false, message: "User or activedate not found" }, { status: 404 });
        }

        const filter = {
            dsid: dscode,
            createdAt: { $gt: user.activedate },
        };

        if (from) {
            filter.createdAt.$gte = new Date(from);
        }
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999); // Important fix here
            filter.createdAt.$lte = toDate;
        }



        const data = await PaymentHistoryModel.find(filter).sort({ createdAt: -1 }).lean();

        return Response.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error("Error fetching PaymentHistory:", error);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
