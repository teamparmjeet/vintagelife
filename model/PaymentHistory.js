import mongoose, { Schema } from "mongoose";

const PaymentHistorySchema = new Schema(

    {
        dsid: { type: String, required: true },
        dsgroup:{type: String, required: true},
        amount: { type: String, required: true },

        bonus_income: { type: String, },
        performance_income: { type: String, },

        sp: { type: String, required: true },
        group: { type: String, required: true },
        type: { type: String, required: true },

        orderno: { type: String },
        levelname: { type: String },
        referencename: { type: String },

        pairstatus: { type: Boolean, required: true, default: false },
        monthlystatus: { type: Boolean, required: true, default: false },

        defaultdata: { type: String, required: true, default: "PaymentHistory" }

    },
    { timestamps: true }
);

const PaymentHistoryModel =
    mongoose.models.PaymentHistory5 || mongoose.model("PaymentHistory5", PaymentHistorySchema);

export default PaymentHistoryModel