import mongoose, { Schema } from "mongoose";

const BonanzaSchema = new Schema(

    {
        image: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true, default: "null" },
        achiversDetails: [
            {
                dscode: { type: String, },
                date: { type: String, },
            }
        ],
        defaultdata: { type: String, required: true, default: "Bonanza" }

    },
    { timestamps: true }
);

const BonanzaModel =
    mongoose.models.Bonanzatest3 || mongoose.model("Bonanzatest3", BonanzaSchema);

export default BonanzaModel