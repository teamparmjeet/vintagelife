import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import LevelsModel from "@/model/Level";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { emailid } = params;

    const user = await UserModel.findOne({ email: emailid });
    if (!user) {
      return Response.json(
        {
          message: "User not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    let totalBonusIncome = 0;
    let totalPerformanceIncome = 0;

    // Only proceed with level lookup and income calc if usertype is "0" or "1"
    if (user.usertype === "0" || user.usertype === "1") {
      const userLevel = await LevelsModel.findOne({ level_name: user.level });

      if (userLevel) {
        const userSao = parseInt(userLevel.sao);
        if (!isNaN(userSao)) {
          const allLevels = await LevelsModel.find();

          for (const level of allLevels) {
            const levelSao = parseInt(level.sao);
            if (!isNaN(levelSao) && levelSao <= userSao) {
              if (user.activesp == "100") {
                totalBonusIncome += parseFloat(level.bonus_income || 0);
              }
              totalPerformanceIncome += parseFloat(level.performance_income || 0);
            }
          }
        }
      }
    }

    return Response.json(
      {
        ...user._doc,
        totalBonusIncome: user.activesp == "100" ? totalBonusIncome : 0,
        totalPerformanceIncome,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error on getting user:", error);
    return Response.json(
      {
        message: "Error on getting user!",
        success: false,
      },
      { status: 500 }
    );
  }
}
