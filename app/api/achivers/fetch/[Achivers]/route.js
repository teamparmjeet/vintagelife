import dbConnect from "@/lib/dbConnect";
import AchiversModel from "@/model/Achivers";


export const GET = async (request) => {
  await dbConnect();

  try {
    const data = await AchiversModel.find({ defaultdata: "Achivers" });

    return Response.json(
      {
        message: "fetched successfully!",
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
