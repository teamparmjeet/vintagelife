import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Order";

export async function GET(request, { params }) {
    await dbConnect();

    try {
        const dscode = decodeURIComponent(params?.dscode || "");
        const url = new URL(request.url);
        const dateFrom = url.searchParams.get("dateFrom");
        const dateTo = url.searchParams.get("dateTo");

        let filter = { dscode, status: true };

        if (dateFrom || dateTo) {
            filter.createdAt = {};
            if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) {
                const endDate = new Date(dateTo);
                endDate.setHours(23, 59, 59, 999); // Include entire day
                filter.createdAt.$lte = endDate;
            }
        }

        // Fetch the oldest order
        const oldestOrder = await OrderModel.findOne()
            .sort({ createdAt: 1 }) // Get the oldest order
            .select("_id")
            .lean();

        // Exclude the oldest order from the filter
        if (oldestOrder) {
            filter._id = { $ne: oldestOrder._id };
        }

        const orders = await OrderModel.find(filter)
            .select("createdAt totalsp")
            .sort({ createdAt: -1 }) // Sort by latest createdAt
            .lean();

        return Response.json({ data: orders, success: true }, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return Response.json(
            { message: "Error fetching data!", success: false },
            { status: 500 }
        );
    }
}
