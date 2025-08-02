// app/api/newclosing/bonanza/route.js

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import MonthsModel from "@/model/3monthsboonanza";

export async function GET(req) {
  try {
    await dbConnect();

    // Get latest bonanza data
    const bonanzaData = await MonthsModel.findOne().sort({ createdAt: -1 });
    if (!bonanzaData) {
      return Response.json({ success: false, message: "No bonanza data found" }, { status: 404 });
    }

    // Create levels requirement map
    const levelsMap = {};
    for (const levelEntry of bonanzaData.levels) {
      levelsMap[levelEntry.level] = {
        sao: parseFloat(levelEntry.sao || "0"),
        sgo: parseFloat(levelEntry.sgo || "0"),
      };
    }

    const qualifiedUsers = [];

    // Loop over each bonanza user detail
    for (const detail of bonanzaData.UserDetails) {
      const dsid = detail.dsid;
      const prevSaosp = parseFloat(detail.saosp || "0");
      const prevSgosp = parseFloat(detail.sgosp || "0");
      const bonanzaLevel = detail.userlevel || "";

      // Get level requirement from bonanza levels map
      const levelRequirement = levelsMap[bonanzaLevel];
      if (!levelRequirement) continue;

      const requiredSao = levelRequirement.sao;
      const requiredSgo = levelRequirement.sgo;

      // Get current user sales from UserModel
      const user = await UserModel.findOne({ dscode: dsid });
      if (!user) continue;

      const userSaosp = parseFloat(user.saosp || "0");
      const userSgosp = parseFloat(user.sgosp || "0");

      // Calculate final targets
      const targetSaosp = prevSaosp + requiredSao;
      const targetSgosp = prevSgosp + requiredSgo;

      // Check qualification
      if (userSaosp >= targetSaosp && userSgosp >= targetSgosp) {
        qualifiedUsers.push({
          username: user.name,
          dsid,
          mobile: user.mobileNo,
          level: bonanzaLevel, // always from bonanza
          saosp: userSaosp,
          sgosp: userSgosp,
          previousSaosp: prevSaosp,
          previousSgosp: prevSgosp,
          requiredAddSao: requiredSao,
          requiredAddSgo: requiredSgo,
          totalTargetSaosp: targetSaosp,
          totalTargetSgosp: targetSgosp,
        });
      }
    }

    return Response.json({ success: true, users: qualifiedUsers }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
