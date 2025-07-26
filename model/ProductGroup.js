import mongoose, { Schema } from "mongoose";

const ProductGroupSchema = new Schema(

    {
        groupname: { type: String, required: true },
        defaultdata: { type: String, required: true, default: "ProductGroup" }

    },
    { timestamps: true }
);

const ProductGroupModel =
    mongoose.models.ProductGrouptest || mongoose.model("ProductGrouptest", ProductGroupSchema);

export default ProductGroupModel