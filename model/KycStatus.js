import mongoose, { Schema } from "mongoose";

const KycSchema = new Schema(
  {
    dscode: { type: String, required: true, unique: true },
    bankkyc: { type: Boolean, default: false },
    bankresn: { type: String },

    pankkyc: { type: Boolean, default: false },
    panresn: { type: String },

    aadharkkyc: { type: Boolean, default: false },
    aadharresn: { type: String },

    rejectedbank: { type: Boolean, default: false },
    rejectedpan: { type: Boolean, default: false },
    rejectedaadhar: { type: Boolean, default: false },

    defaultdata: { type: String, default: "kyc" },
  },
  { timestamps: true }
);

const KycModel = mongoose.models.kyc2 || mongoose.model("kyc2", KycSchema);
export default KycModel;
