import dbConnect from "@/lib/dbConnect";
import LevelsModel from "@/model/Level";


export const GET = async (request) => {
  await dbConnect();

  try {
    const data = await LevelsModel.find({ defaultdata: "Level" });
    return Response.json(
      {
        message: "data fetched successfully!",
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching", error);
    return Response.json(
      {
        message: "Error fetching",
        success: false,
      },
      { status: 500 }
    );
  }
};
