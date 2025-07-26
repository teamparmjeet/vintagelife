// app/api/newclosing/bonanza/route.js

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import MonthsModel from "@/model/3monthsboonanza";

export async function GET(req) {
  try {
    await dbConnect();

    const allUsers = await UserModel.find({});
    const bonanzaData = await MonthsModel.findOne().sort({ createdAt: -1 });

    if (!bonanzaData) {
      return Response.json({ success: false, message: "No bonanza data found" }, { status: 404 });
    }

    // Create map of UserDetails
    const userDetailsMap = {};
    for (const detail of bonanzaData.UserDetails) {
      userDetailsMap[detail.dsid] = {
        saosp: parseFloat(detail.saosp || "0"),
        sgosp: parseFloat(detail.sgosp || "0"),
        level: detail.userlevel || "",
      };
    }

    // Create map of level thresholds
    const levelsMap = {};
    for (const levelEntry of bonanzaData.levels) {
      levelsMap[levelEntry.level] = {
        sao: parseFloat(levelEntry.sao || "0"),
        sgo: parseFloat(levelEntry.sgo || "0"),
      };
    }

    const qualifiedUsers = [];

    for (const user of allUsers) {
      const dsid = user.dscode;
      if (!dsid || !userDetailsMap[dsid]) continue;

      const userSaosp = parseFloat(user.saosp || "0");
      const userSgosp = parseFloat(user.sgosp || "0");

      const detail = userDetailsMap[dsid];
      const prevSaosp = detail.saosp;
      const prevSgosp = detail.sgosp;
      const userLevel = detail.level;

      const levelRequirement = levelsMap[userLevel];
      if (!levelRequirement) continue;

      const requiredSao = levelRequirement.sao;
      const requiredSgo = levelRequirement.sgo;

      // Final threshold = user's previous + required increase
      const targetSaosp = prevSaosp + requiredSao;
      const targetSgosp = prevSgosp + requiredSgo;

      if (userSaosp >= targetSaosp && userSgosp >= targetSgosp) {
        qualifiedUsers.push({
          username: user.name,
          dsid,
          mobile: user.mobileNo,
          level: userLevel,
          saosp: userSaosp,
          sgosp: userSgosp,
          previousSaosp: prevSaosp,
          previousSgosp: prevSgosp,
          requiredAddSao: requiredSao,
          requiredAddSgo: requiredSgo,
          totalTargetSaosp: targetSaosp,
          totalTargetSgosp: targetSgosp
        });
      }
    }

    return Response.json({ success: true, users: qualifiedUsers }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
