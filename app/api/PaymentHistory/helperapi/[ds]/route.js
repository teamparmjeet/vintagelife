import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const ds = url.pathname.split("/").pop();
    if (!ds) {
      return Response.json(
        {
          message: "Invalid request! ds parameter is missing.",
          success: false,
        },
        { status: 400 }
      );
    }

    const mainUser = await UserModel.findOne({ dscode: ds }).select("dscode group");
    if (!mainUser) {
      return Response.json(
        {
          message: "User not found!",
          success: false,
        },
        { status: 200 }
      );
    }

    const saoUsers = [];
    const sgoUsers = [];

    const collectDownlines = async (parentDs) => {
      const users = await UserModel.find({ pdscode: parentDs }).select("dscode group");

      for (const user of users) {
        if (user.group === "SAO") {
          saoUsers.push(user);
        } else if (user.group === "SGO") {
          sgoUsers.push(user);
        }

        await collectDownlines(user.dscode); // recursive call
      }
    };

    await collectDownlines(ds);

    return Response.json(
      {
        success: true,
        mainUser,
        saoDownlines: saoUsers,
        sgoDownlines: sgoUsers,
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
