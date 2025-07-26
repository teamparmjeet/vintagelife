import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";

export async function DELETE(req, { params }) {
    await dbConnect();

    try {
        const { id } = params;

        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return Response.json({
                message: "Product not found",
                success: false
            }, { status: 404 });
        }

        return Response.json({
            message: "Product deleted successfully",
            success: true
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({
            message: "Error deleting product",
            success: false
        }, { status: 500 });
    }
}
