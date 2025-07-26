import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema(

    {
        dsid: { type: String, required: true },
        amount: { type: String, required: true },
        tds: { type: String, required: true },
        payamount: { type: String, required: true },
        accountholder: { type: String, required: true },
        accountNumber: { type: String, required: true },
        ifsc: { type: String, required: true },
        bankname: { type: String, required: true },
        branch: { type: String, required: true },
        bankreferencenumber: { type: String, required: true },
        status: { type: String, enum: ["0", "1"], default: "0", required: true },
        
        defaultdata: { type: String, required: true, default: "Payment" }

    },
    { timestamps: true }
);

const PaymentModel =
    mongoose.models.Paymenttest || mongoose.model("Paymenttest", PaymentSchema);

export default PaymentModel