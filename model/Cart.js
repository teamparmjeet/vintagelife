import mongoose, { Schema } from "mongoose";

const CartSchema = new Schema(

    {
        dscode: { type: String, required: true },
        totalsp: { type: String, required: true },
        netamount: { type: String, required: true },
        productDetails: [
            {
                productgroup: { type: String, },
                product: { type: String, },
                quantity: { type: String, },
                price: { type: String },
                sp: { type: String }
            }
        ],

    },
    { timestamps: true }
);

const CartModel =
    mongoose.models.Carttest3 || mongoose.model("Carttest3", CartSchema);

export default CartModel