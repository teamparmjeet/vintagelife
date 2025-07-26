import mongoose, { Schema } from "mongoose";

const AchiversSchema = new Schema(

    {
        name: { type: String },
        dsid: { type: String },
        image: { type: String },
        address: { type: String },
        achivementtype1: { type: String },
        ranktype:{type: String },
        triptype:{type: String },
        defaultdata: { type: String, required: true, default: "Achivers" }

    },
    { timestamps: true }
);

const AchiversModel =
    mongoose.models.Achiverstest2 || mongoose.model("Achiverstest2", AchiversSchema);

export default AchiversModel