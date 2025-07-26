import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";

export const GET = async (request) => {
  await dbConnect();

  try {
    const data = await ProductModel.find({ defaultdata: "product" });

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
