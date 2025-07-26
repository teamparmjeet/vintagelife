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

    const mainUser = await UserModel.findOne({ dscode: ds });
    if (!mainUser) {
      return Response.json(
        {
          message: "User not found!",
          success: false,
        },
        { status: 200 }
      );
    }

    // Find 2 users from each group (SAO and SGO)
    const saoUsers = await UserModel.find({ pdscode: ds, group: "SAO" })
      .sort({ createdAt: 1 })
      .limit(2);

    const sgoUsers = await UserModel.find({ pdscode: ds, group: "SGO" })
      .sort({ createdAt: 1 })
      .limit(2);

    return Response.json(
      {
        success: true,
        mainUser,
        relatedUsers: [...saoUsers, ...sgoUsers],
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
