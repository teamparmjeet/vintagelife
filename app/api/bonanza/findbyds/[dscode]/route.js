import dbConnect from "@/lib/dbConnect";
import SpringBonanza from "@/model/SpringBonanza";

export const GET = async (request, { params }) => {
  await dbConnect();

  try {
    const { dscode } = params; // Extract dscode from the URL

    if (!dscode) {
      return Response.json(
        { message: "dscode parameter is required!", success: false },
        { status: 400 }
      );
    }

    const data = await SpringBonanza.find({
      "achiversDetails.dscode": dscode, // Query inside the array
    });

    return Response.json(
      {
        message: "Bonanza data fetched successfully!",
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching Bonanza data:", error);
    return Response.json(
      {
        message: "Error fetching Bonanza data!",
        success: false,
      },
      { status: 500 }
    );
  }
};
