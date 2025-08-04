import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import ClosingHistoryModel from "@/model/ClosingHistory";
import TravelfundModel from "@/model/travelfund";
import MonthlyClosingHistoryModel from "@/model/MonthleClosingHistory";
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

        const successWithdrawalsTravelAgg = await TravelfundModel.aggregate([
            { $match: { status: true } },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $toDouble: "$payamount" } },
                },
            },
        ]);

        const pendingWithdrawalsTravelAgg = await TravelfundModel.aggregate([
            { $match: { status: false } },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $toDouble: "$payamount" } },
                },
            },
        ]);

        const pendingCountTravel = await TravelfundModel.countDocuments({
            status: false,
            invalidstatus: false,
        });



        const successWithdrawalstravel = successWithdrawalsTravelAgg[0]?.total || 0;
        const pendingWithdrawalstravel = pendingWithdrawalsTravelAgg[0]?.total || 0;



        const successWithdrawalsMonthlyAgg = await MonthlyClosingHistoryModel.aggregate([
            { $match: { status: true } },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $toDouble: "$amount" } },
                },
            },
        ]);

        const pendingWithdrawalsMonthlyAgg = await MonthlyClosingHistoryModel.aggregate([
            { $match: { status: false } },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $toDouble: "$amount" } },
                },
            },
        ]);

        const pendingCountMonthly = await MonthlyClosingHistoryModel.countDocuments({
            status: false,
            invalidstatus: false,
        });
        const successWithdrawalsMonthly = successWithdrawalsMonthlyAgg[0]?.total || 0;
        const pendingWithdrawalsMonthly = pendingWithdrawalsMonthlyAgg[0]?.total || 0;

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

            successWithdrawalstravel,
            pendingWithdrawalstravel,
            pendingCounttravel: pendingCountTravel,

            successWithdrawalsMonthly,
            pendingWithdrawalsMonthly,
            pendingCountMonthly,
        });
    } catch (error) {
        console.error("Error getting stats:", error);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
        });
    }
}
