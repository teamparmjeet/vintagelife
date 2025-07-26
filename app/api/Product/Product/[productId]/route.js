import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";

export async function GET(req, { params }) {
    await dbConnect();

    try {
        const { productId } = params;
        const product = await ProductModel.findById(productId);

        if (!product) {
            return Response.json({
                message: "Product not found",
                success: false,
            }, { status: 404 });
        }

        return Response.json({
            message: "Product fetched successfully",
            success: true,
            data: product
        }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({
            message: "Error fetching product",
            success: false
        }, { status: 500 });
    }
}
