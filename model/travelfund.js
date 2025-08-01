import mongoose, { Schema } from "mongoose";

const TravelfunSchema = new Schema(

    {
        dsid: { type: String, required: true },
        name: { type: String, required: true },
        acnumber: { type: String, },
        ifscCode: { type: String, },
        bankName: { type: String, },

        amount: { type: String, required: true },
        charges: { type: String, required: true },
        payamount: { type: String, required: true },

        utr: { type: String, },
        invalidresn: { type: String },
        invalidstatus: { type: Boolean, required: true, default: false },

        date: { type: String, required: true },
        status: { type: Boolean, required: true, default: false },
        updatestatus: { type: Boolean, required: true, default: false },
        statusapprovedate: { type: Date },

        defaultdata: { type: String, required: true, default: "travelfund" }

    },
    { timestamps: true }
);

const TravelfundModel =
    mongoose.models.travelfund || mongoose.model("travelfund", TravelfunSchema);

export default TravelfundModel