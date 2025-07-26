import dbConnect from "@/lib/dbConnect";
import MonthsModel from "@/model/3monthsboonanza";

export const GET = async (request) => {
  await dbConnect();

  try {
    const data = await MonthsModel.find({ defaultdata: "months" });

    return Response.json(
      {
        message: "data fetched successfully!",
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching data", error);
    return Response.json(
      {
        message: "Error fetching image URLs!",
        success: false,
      },
      { status: 500 }
    );
  }
};
