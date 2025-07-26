import mongoose, { Schema } from "mongoose";

const DashboardimageSchema = new Schema(

    {
        image: { type: String, required: true },
        defaultdata: { type: String, required: true, default: "Dashboardimage" }

    },
    { timestamps: true }
);

const DashboardimageModel =
    mongoose.models.Dashboardimagetest || mongoose.model("Dashboardimagetest", DashboardimageSchema);

export default DashboardimageModel