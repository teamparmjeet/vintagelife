import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import ClosingHistoryModel from "@/model/ClosingHistory";
import OrderModel from "@/model/Order";
export async function POST(req) {
    await dbConnect();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    try {
        // USER STATISTICS
        const totalUsers = await UserModel.countDocuments({
            defaultdata: { $in: ["user", "freeze", "block"] },
        });

        const activeUsers = await UserModel.countDocuments({
            usertype: "1",
            defaultdata: "user",
        });

        const pendingUsers = await UserModel.countDocuments({
            usertype: "0",
            defaultdata: "user",
        });

        const suspendedUsers = await UserModel.countDocuments({
            defaultdata: { $nin: ["user"] },
        });

        const todayRegistrations = await UserModel.countDocuments({
            createdAt: { $gte: todayStart, $lte: todayEnd },
        });

        const todayGreen = await UserModel.countDocuments({
            activedate: { $gte: todayStart, $lte: todayEnd },
        });

        // WITHDRAWAL STATISTICS

        // Convert amount string to number using aggregation
        const successWithdrawalsAgg = await ClosingHistoryModel.aggregate([
            {
                $match: {
                    status: true,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $toDouble: "$amount",
                        },
                    },
                },
            },
        ]);

        const pendingWithdrawalsAgg = await ClosingHistoryModel.aggregate([
            {
                $match: {
                    status: false,
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $toDouble: "$amount",
                        },
                    },
                },
            },
        ]);

        const pendingCount = await ClosingHistoryModel.countDocuments({
            status: false,
            invalidstatus: false,
        });

        const successWithdrawals = successWithdrawalsAgg[0]?.total || 0;
        const pendingWithdrawals = pendingWithdrawalsAgg[0]?.total || 0;

        return Response.json({
            totalUsers,
            activeUsers,
            pendingUsers,
            suspendedUsers,
            todayRegistrations,
            todayGreen,
            successWithdrawals,
            pendingWithdrawals,
            pendingCount,
        });
    } catch (error) {
        console.error("Error getting stats:", error);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
        });
    }
}
