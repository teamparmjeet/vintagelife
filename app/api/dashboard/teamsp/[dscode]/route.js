import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import OrderModel from "@/model/Order";
import moment from "moment";

async function buildSubTree(ds, allUsersMap, visited = new Set()) {
  if (visited.has(ds)) return [];
  visited.add(ds);

  const directMembers = allUsersMap.get(ds) || [];
  let team = [...directMembers];

  for (const member of directMembers) {
    const subTeam = await buildSubTree(member.dscode, allUsersMap, visited);
    team.push(...subTeam);
  }

  return team;
}

export async function GET(request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const ds = url.pathname.split("/").pop();

    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    if (!ds) {
      return Response.json({ message: "Invalid request! dscode missing.", success: false }, { status: 400 });
    }

    const mainUser = await UserModel.findOne({ dscode: ds });
    if (!mainUser) {
      return Response.json({ message: "User not found!", success: false }, { status: 404 });
    }

    const userFilter = {};
    if (fromDate && toDate) {
      userFilter.createdAt = { $gte: fromDate, $lte: toDate };
    }

    const allUsers = await UserModel.find(userFilter);
    const allUsersMap = new Map();
    allUsers.forEach(user => {
      if (!allUsersMap.has(user.pdscode)) {
        allUsersMap.set(user.pdscode, []);
      }
      allUsersMap.get(user.pdscode).push(user);
    });

    const directChildren = allUsersMap.get(ds) || [];

    // Preload all orders for all users once to avoid repeated DB hits
    const allUserCodes = allUsers.map(u => u.dscode);
    const allOrders = await OrderModel.find({
      dscode: { $in: allUserCodes },
      status: true
    });

    const orderMap = new Map();
    for (const order of allOrders) {
      const code = order.dscode;
      if (!orderMap.has(code)) orderMap.set(code, []);
      orderMap.get(code).push(order);
    }

    let totalSGO = 0, totalSAO = 0;
    let totalActiveSGO = 0, totalActiveSAO = 0;
    let totalEarnSP = 0, totalSaoSP = 0, totalSgoSP = 0;

    if (mainUser.group === "SAO") {
      totalSAO += 1;
      if (mainUser.usertype === "1") totalActiveSAO += 1;
      totalEarnSP += parseFloat(mainUser.earnsp) || 0;
      totalSaoSP += parseFloat(mainUser.saosp) || 0;
      totalSgoSP += parseFloat(mainUser.sgosp) || 0;
    }

    if (mainUser.group === "SGO") {
      totalSGO += 1;
      if (mainUser.usertype === "1") totalActiveSGO += 1;
      totalEarnSP += parseFloat(mainUser.earnsp) || 0;
      totalSaoSP += parseFloat(mainUser.saosp) || 0;
      totalSgoSP += parseFloat(mainUser.sgosp) || 0;
    }

    for (const child of directChildren) {
      const visited = new Set();
      const subTree = await buildSubTree(child.dscode, allUsersMap, visited);
      const fullGroup = [child, ...subTree];

      const isSAO = child.group === "SAO";
      const isSGO = child.group === "SGO";

      if (isSAO) {
        totalSAO += fullGroup.length;
        totalActiveSAO += fullGroup.filter(u => u.usertype === "1").length;
      } else if (isSGO) {
        totalSGO += fullGroup.length;
        totalActiveSGO += fullGroup.filter(u => u.usertype === "1").length;
      }

      for (const u of fullGroup) {
        if (u.usertype !== "0") {
          totalEarnSP += parseFloat(u.earnsp) || 0;
        }

        const totalUserSP =
          (parseFloat(u.saosp) || 0) +
          (parseFloat(u.sgosp) || 0);

        if (isSAO) {
          totalSaoSP += totalUserSP;
        } else if (isSGO) {
          totalSgoSP += totalUserSP;
        }

        if (u.usertype === "0") {
          const orders = orderMap.get(u.dscode) || [];
          let userActualSP = 0;
          orders.forEach(order => {
            userActualSP += parseFloat(order.totalsp) || 0;
          });

          if (isSAO) {
            totalSaoSP -= userActualSP;
          } else if (isSGO) {
            totalSgoSP -= userActualSP;
          }
        }
      }
    }

    const totalIncome = (parseFloat(mainUser.earnsp) || 0) * 10;

    const today = moment();
    const dayOfWeek = today.isoWeekday(); // Monday = 1, Sunday = 7

    const daysSinceWednesday = (dayOfWeek >= 4) ? dayOfWeek - 4 : 7 - (4 - dayOfWeek);
    const startOfWeek = today.clone().subtract(daysSinceWednesday, 'days').startOf('day');
    const endOfWeek = startOfWeek.clone().add(6, 'days').endOf('day');

    const userOrders = await OrderModel.find({
      status: true,
      dscode: ds,
      createdAt: { $gte: startOfWeek, $lte: endOfWeek }
    });

    let currentWeekSaoSP = 0, currentWeekSgoSP = 0;
    userOrders.forEach(order => {
      const totalSP = parseFloat(order.totalsp) || 0;
      if (order.salegroup === "SAO") currentWeekSaoSP += totalSP;
      if (order.salegroup === "SGO") currentWeekSgoSP += totalSP;
    });

    return Response.json({
      success: true,
      dscode: ds,
      mainUser: {
        dscode: mainUser.dscode,
        level: mainUser.level,
        saosp: Number((parseFloat(mainUser.saosp) || 0).toFixed(2)),
        sgosp: Number((parseFloat(mainUser.sgosp) || 0).toFixed(2)),
        earnsp: Number((parseFloat(mainUser.earnsp) || 0).toFixed(2)),
        group: mainUser.group,
      },

      totalSGO,
      totalSAO,
      totalActiveSGO,
      totalActiveSAO,
      totalEarnSP: Number(totalEarnSP.toFixed(2)),
      totalSaoSP: Number(totalSaoSP.toFixed(2)),
      totalSgoSP: Number(totalSgoSP.toFixed(2)),
      totalIncome: Number(totalIncome.toFixed(2)),
      currentWeekSaoSP: Number(currentWeekSaoSP.toFixed(2)),
      currentWeekSgoSP: Number(currentWeekSgoSP.toFixed(2)),
    }, { status: 200 });


  } catch (error) {
    console.error("Error getting team stats:", error);
    return Response.json({ message: "Error fetching data!", success: false }, { status: 500 });
  }
}
