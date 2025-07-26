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

    const userLevel = await LevelsModel.findOne({ level_name: user.level });
    if (!userLevel) {
      return Response.json(
        {
          message: "User level not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    const userSao = parseInt(userLevel.sao);
    if (isNaN(userSao)) {
      return Response.json(
        {
          message: "Invalid sao value for user level!",
          success: false,
        },
        { status: 400 }
      );
    }

    const allLevels = await LevelsModel.find();

    let totalBonusIncome = 0;
    let totalPerformanceIncome = 0;

    for (const level of allLevels) {
      const levelSao = parseInt(level.sao);
      if (!isNaN(levelSao) && levelSao <= userSao) {
        totalBonusIncome += parseFloat(level.bonus_income || 0);
        totalPerformanceIncome += parseFloat(level.performance_income || 0);
      }
    }

    return Response.json(
      {
        ...user._doc,
        totalBonusIncome,
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
