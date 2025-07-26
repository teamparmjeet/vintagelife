import dbConnect from "@/lib/dbConnect";
import PaymentHistoryModel from "@/model/PaymentHistory";

export async function GET(req) {
    await dbConnect();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const dsid = url.searchParams.get("dsid") || "";
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");
    const closingstatus = url.searchParams.get("closingstatus");
    const fromDate = url.searchParams.get("fromDate");
    const toDate = url.searchParams.get("toDate");

    const query = {};

    if (dsid) query.dsid = dsid;
    if (type) query.type = type;

    if (status === "true") query.pairstatus = true;
    else if (status === "false") query.pairstatus = false;

    if (closingstatus === "true") query.monthlystatus = true;
    else if (closingstatus === "false") query.monthlystatus = false;

    if (fromDate && toDate) {
        query.createdAt = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate + "T23:59:59.999Z"),
        };
    }

    try {
        const totalDocs = await PaymentHistoryModel.countDocuments(query);
        const totalPages = Math.ceil(totalDocs / limit);

        const data = await PaymentHistoryModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        return Response.json({
            success: true,
            data,
            totalPages,
        });
    } catch (error) {
        console.error("Error in PaymentHistory GET:", error);
        return Response.json({ success: false, message: "Server error" }, { status: 500 });
    }
}
