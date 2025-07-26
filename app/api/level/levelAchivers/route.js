import dbConnect from "@/lib/dbConnect";
import LevelsModel from "@/model/Level";
import UserModel from "@/model/User";

export const GET = async (request) => {
  await dbConnect();

  try {
    // Step 1: Get all levels where defaultdata is "Level"
    const levels = await LevelsModel.find({ defaultdata: "Level" });

    // Step 2: Sort levels based on numeric value of 'sao'
    const sortedLevels = levels.sort((a, b) => {
      return parseInt(a.sao, 10) - parseInt(b.sao, 10);
    });

    // Step 3: For each sorted level, count users with that level name
    const levelUserCounts = await Promise.all(
      sortedLevels.map(async (level) => {
        const userCount = await UserModel.countDocuments({ level: level.level_name });
        return {
          level: level.level_name,
          sao: level.sao,
          userCount,
        };
      })
    );

    return new Response(JSON.stringify({ success: true, data: levelUserCounts }), {
      status: 200,
    });

  } catch (error) {
    console.error("Error getting level user counts:", error);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), {
      status: 500,
    });
  }
};
