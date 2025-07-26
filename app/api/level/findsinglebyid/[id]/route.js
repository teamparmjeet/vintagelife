import dbConnect from "@/lib/dbConnect";
import LevelsModel from "@/model/Level";
export async function GET(request, { params }) {
  await dbConnect();

  try {

    const { id } = await params;


    const level = await LevelsModel.findOne({ _id: id });
    if (!level) {
      return Response.json(
        {
          message: "level not found!",
          success: false,
        },
        { status: 404 }
      );
    }

    return Response.json(level, { status: 200 });
  } catch (error) {
    console.log("Error on getting level:", error);
    return Response.json(
      {
        message: "Error on getting level!",
        success: false,
      },
      { status: 500 }
    );
  }
}
