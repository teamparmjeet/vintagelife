import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/Cart";

export async function PATCH(req, { params }) {
    await dbConnect();
  
    try {
      const { id } = params;
      const data = await req.json();
  
      const updatedProduct = await CartModel.findByIdAndUpdate(id, data, {
        new: true,
      });
  
      if (!updatedProduct) {
        return Response.json(
          { message: "Product not found", success: false },
          { status: 404 }
        );
      }
  
      return Response.json(
        {
          message: "Product updated successfully",
          success: true,
          data: updatedProduct,
        },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return Response.json(
        { message: "Error updating product", success: false },
        { status: 500 }
      );
    }
  }
  