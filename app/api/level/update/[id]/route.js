import dbConnect from "@/lib/dbConnect";
import LevelsModel from "@/model/Level";

export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await request.json();

    const updatedLevel = await LevelsModel.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedLevel) {
      return Response.json(
        { message: "Level not found!", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Level updated successfully", success: true, data: updatedLevel },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating level:", error);
    return Response.json(
      { message: "Error updating level!", success: false },
      { status: 500 }
    );
  }
}
