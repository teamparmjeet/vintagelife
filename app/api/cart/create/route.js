import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/Cart";

export async function POST(req) {
    await dbConnect();

    try {
        const data = await req.json();
        const { dscode, productDetails } = data;

        if (!dscode || !Array.isArray(productDetails) || productDetails.length === 0) {
            return Response.json({ message: "Invalid data", success: false }, { status: 400 });
        }

        for (const product of productDetails) {
            // Check if a cart entry exists for this dscode and product
            const existingCart = await CartModel.findOne({
                dscode,
                "productDetails.product": product.product
            });

            if (existingCart) {
                // Update quantity
                existingCart.productDetails[0].quantity = (
                    Number(existingCart.productDetails[0].quantity) + Number(product.quantity)
                ).toString();

                // Recalculate totals
                const totalSP = Number(existingCart.productDetails[0].quantity) * Number(product.sp);
                const netAmount = Number(existingCart.productDetails[0].quantity) * Number(product.price);

                existingCart.totalsp = totalSP.toString();
                existingCart.netamount = netAmount.toString();

                await existingCart.save();
            } else {
                // Create new cart document for this product
                const totalSP = Number(product.quantity) * Number(product.sp);
                const netAmount = Number(product.quantity) * Number(product.price);

                const newCart = new CartModel({
                    dscode,
                    productDetails: [product], // only this product
                    totalsp: totalSP.toString(),
                    netamount: netAmount.toString()
                });

                await newCart.save();
            }
        }

        return Response.json({
            message: "Cart updated successfully",
            success: true
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating cart:", error);
        return Response.json({
            message: "Error in Order Registration",
            success: false
        }, { status: 500 });
    }
}
