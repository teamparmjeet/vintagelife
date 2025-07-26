import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

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

export async function GET() {
  await dbConnect();

  try {
    // Get all users
    const allUsers = await UserModel.find({}).lean();
    const allUsersMap = new Map();

    // Group users by pdscode
    allUsers.forEach(user => {
      if (!allUsersMap.has(user.pdscode)) {
        allUsersMap.set(user.pdscode, []);
      }
      allUsersMap.get(user.pdscode).push(user);
    });

    const responseData = [];
    for (const mainUser of allUsers) {
      const ds = mainUser.dscode;

      const visited = new Set();
      const subTree = await buildSubTree(ds, allUsersMap, visited);
      const fullTeam = [mainUser, ...subTree]; // include self

      let totalEarnSP = 0;
      let totalSaoSP = 0;
      let totalSgoSP = 0;

      const directChildren = allUsersMap.get(ds) || [];

      if (mainUser.usertype !== "0") {
        totalEarnSP += parseFloat(mainUser.earnsp) || 0;
        totalSaoSP += parseFloat(mainUser.saosp) || 0;
        totalSgoSP += parseFloat(mainUser.sgosp) || 0;
      }

      for (const child of directChildren) {
        const visitedChild = new Set();
        const subTeam = await buildSubTree(child.dscode, allUsersMap, visitedChild);
        const fullGroup = [child, ...subTeam];

        const isSAO = child.group === "SAO";
        const isSGO = child.group === "SGO";

        fullGroup.forEach(u => {
          if (u.usertype !== "0") {
            totalEarnSP += parseFloat(u.earnsp) || 0;

            const saosp = parseFloat(u.saosp) || 0;
            const sgosp = parseFloat(u.sgosp) || 0;
            const totalSP = saosp + sgosp;

            if (isSAO) {
              totalSaoSP += totalSP;
            } else if (isSGO) {
              totalSgoSP += totalSP;
            }
          }
        });
      }

      if (totalSaoSP > 0 && totalSgoSP > 0) {
        responseData.push({
          success: true,
           _id: mainUser._id.toString(),
          dscode: ds,
          name: mainUser.name,
          level: mainUser.level,
          totalSaoSP:mainUser.saosp,
          totalSgoSP:mainUser.sgosp,
          LevelDetails: mainUser.LevelDetails || [],
          WalletDetails: mainUser.WalletDetails || [],
          activesp: mainUser.activesp || "",
          group: mainUser.group || ""
        });
      }

    }


    return Response.json(responseData, { status: 200 });

  } catch (error) {
    console.error("Error generating stats:", error);
    return Response.json({ message: "Error fetching data!", success: false }, { status: 500 });
  }
}
