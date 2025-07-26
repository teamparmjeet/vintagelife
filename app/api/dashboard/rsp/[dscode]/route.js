import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Order";
import UserModel from "@/model/User";
import moment from "moment";

export async function GET(request, { params }) {
    await dbConnect();

    try {
        const dscode = decodeURIComponent(params?.dscode || "");
        const url = new URL(request.url);
        const dateFrom = url.searchParams.get("dateFrom");
        const dateTo = url.searchParams.get("dateTo");

        const today = moment();
        const dayOfWeek = today.isoWeekday(); // 1 (Mon) to 7 (Sun)

        // Calculate how many days to subtract to get to last Thursday
        const daysSinceWednesday = (dayOfWeek >= 4) ? dayOfWeek - 4 : 7 - (4 - dayOfWeek);
        const weekStart = today.clone().subtract(daysSinceWednesday, 'days').startOf('day');
        const weekEnd = weekStart.clone().add(6, 'days').endOf('day');


        const baseFilter = { dscode, status: true };
        if (dateFrom || dateTo) {
            baseFilter.createdAt = {};
            if (dateFrom) baseFilter.createdAt.$gte = new Date(dateFrom);
            if (dateTo) {
                const endDate = new Date(dateTo);
                endDate.setHours(23, 59, 59, 999);
                baseFilter.createdAt.$lte = endDate;
            }
        }

        const selfOrders = await OrderModel.find({ dscode, status: true }).lean();

        const allUsers = await UserModel.find({}).select("dscode pdscode group activedate").lean();
        const userMapFull = new Map(allUsers.map(u => [u.dscode, u]));

        const userMap = new Map();
        allUsers.forEach(user => {
            if (!userMap.has(user.pdscode)) userMap.set(user.pdscode, []);
            userMap.get(user.pdscode).push(user.dscode);
        });

        function collectTeamCodes(code, collected = new Set()) {
            if (!collected.has(code)) {
                collected.add(code);
                const children = userMap.get(code) || [];
                children.forEach(child => collectTeamCodes(child, collected));
            }
            return collected;
        }

        const teamDSCodes = Array.from(collectTeamCodes(dscode));
        const teamOrders = await OrderModel.find({ dscode: { $in: teamDSCodes }, status: true }).lean();

        const selfTotalOrders = selfOrders.length;
        const selfTotalsp = selfOrders.reduce((sum, o) => sum + parseFloat(o.totalsp), 0);
        const selfWeekOrders = selfOrders.filter(o =>
            moment(o.createdAt).isBetween(weekStart, weekEnd, null, "[]")
        );
        const selfCurrentWeekOrders = selfWeekOrders.length;
        const selfCurrentWeekTotal = selfWeekOrders.reduce((sum, o) => sum + parseFloat(o.totalsp), 0);

        const selfweeksaosp = selfWeekOrders
            .filter(o => o.salegroup === "SAO")
            .reduce((sum, o) => sum + parseFloat(o.totalsp), 0);
        const selfweeksgosp = selfWeekOrders
            .filter(o => o.salegroup === "SGO")
            .reduce((sum, o) => sum + parseFloat(o.totalsp), 0);

        function getRSP(orders, activedate) {
            if (!activedate) return 0;
            return orders
                .filter(o => new Date(o.createdAt) >= new Date(activedate))
                .reduce((sum, o) => sum + parseFloat(o.totalsp), 0);
        }

        function getTeamRSP(orders, allUsersMap, weekOnly = false) {
            const userOrderMap = new Map();

            for (const order of orders) {
                if (weekOnly && !moment(order.createdAt).isBetween(weekStart, weekEnd, null, "[]")) continue;
                if (!userOrderMap.has(order.dscode)) userOrderMap.set(order.dscode, []);
                userOrderMap.get(order.dscode).push(order);
            }

            let total = 0;

            for (const [dscode, userOrders] of userOrderMap.entries()) {
                const user = allUsersMap.get(dscode);
                const activedate = user?.activedate;
                if (!activedate) continue;

                const eligibleOrders = userOrders.filter(o => new Date(o.createdAt) >= new Date(activedate));
                total += eligibleOrders.reduce((sum, o) => sum + parseFloat(o.totalsp), 0);
            }

            return total;
        }

        const selfUser = userMapFull.get(dscode);
        const selfRSPAll = getRSP(selfOrders, selfUser?.activedate);
        const selfRSPWeek = getRSP(selfWeekOrders, selfUser?.activedate);

        const teamRSPAll = getTeamRSP(teamOrders, userMapFull);
        const teamRSPWeek = getTeamRSP(teamOrders, userMapFull, true);

        const teamTotalOrders = teamOrders.length;
        const teamTotalsp = teamOrders.reduce((sum, o) => sum + parseFloat(o.totalsp), 0);
        const teamWeekOrders = teamOrders.filter(o =>
            moment(o.createdAt).isBetween(weekStart, weekEnd, null, "[]")
        );
        const teamCurrentWeekOrders = teamWeekOrders.length;
        const teamCurrentWeekTotal = teamWeekOrders.reduce((sum, o) => sum + parseFloat(o.totalsp), 0);

        const directDownlines = allUsers.filter(u => u.pdscode === dscode);

        const userToDirectGroupMap = new Map();
        for (const child of directDownlines) {
            userToDirectGroupMap.set(child.dscode, child);
        }

        function mapToDirectGroup(userCode) {
            if (userToDirectGroupMap.has(userCode)) return userToDirectGroupMap.get(userCode);

            const visited = new Set();
            let current = userMapFull.get(userCode);
            while (current && !visited.has(current.dscode)) {
                visited.add(current.dscode);
                const parentCode = current.pdscode;
                if (!parentCode) break;
                if (userToDirectGroupMap.has(parentCode)) {
                    const direct = userToDirectGroupMap.get(parentCode);
                    userToDirectGroupMap.set(userCode, direct);
                    return direct;
                }
                current = userMapFull.get(parentCode);
            }
            return null;
        }

        let teamweeksaosp = 0;
        let teamweeksgosp = 0;

        for (const order of teamWeekOrders) {
            const owner = order.dscode;

            if (owner === dscode) {
                const selfUser = userMapFull.get(dscode);
                if (selfUser?.group === "SAO") teamweeksaosp += parseFloat(order.totalsp);
                else if (selfUser?.group === "SGO") teamweeksgosp += parseFloat(order.totalsp);
            } else {
                const direct = mapToDirectGroup(owner);
                if (direct?.group === "SAO") teamweeksaosp += parseFloat(order.totalsp);
                else if (direct?.group === "SGO") teamweeksgosp += parseFloat(order.totalsp);
            }
        }

        return Response.json({
            success: true,

            // Self stats
            totalOrders: selfTotalOrders,
            totalsp: selfTotalsp,
            currentWeekOrders: selfCurrentWeekOrders,
            currentWeekTotal: selfCurrentWeekTotal,
            selfweeksaosp,
            selfweeksgosp,
            selfRSPAll,
            selfRSPWeek,

            // Team stats (includes self)
            teamTotalOrders,
            teamTotalsp,
            teamCurrentWeekOrders,
            teamCurrentWeekTotal,
            teamRSPAll,
            teamRSPWeek,
            teamweeksaosp,
            teamweeksgosp
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return Response.json({ message: "Error fetching data!", success: false }, { status: 500 });
    }
}
