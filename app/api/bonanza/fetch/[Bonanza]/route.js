import dbConnect from "@/lib/dbConnect";
import SpringBonanza from "@/model/SpringBonanza";

export const GET = async (request) => {
  await dbConnect();

  try {
    const data = await SpringBonanza.find({ defaultdata: "Bonanza" });

    return Response.json(
      {
        message: "Image URLs fetched successfully!",
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching image URLs:", error);
    return Response.json(
      {
        message: "Error fetching image URLs!",
        success: false,
      },
      { status: 500 }
    );
  }
};
