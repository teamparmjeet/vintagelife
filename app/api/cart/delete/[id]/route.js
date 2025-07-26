import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/Cart";

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    const deletedProduct = await CartModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return Response.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "Product deleted successfully",
        success: true,
        data: deletedProduct,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Error deleting product", success: false },
      { status: 500 }
    );
  }
}
