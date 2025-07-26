import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(

    {
        orderNo: { type: String, required: true, default: "0" },
        date: { type: Date, required: true },
        transactionId: { type: String, },
        dscode: { type: String, required: true },
        dsname: { type: String, required: true },
        address: { type: String, required: true },
        mobileno: { type: Number, required: true },
        shippingAddress: { type: String, required: true },
        shippingmobile: { type: String, required: true },
        shippinpPincode: { type: String, required: true },
        paymentmod: { type: String, required: true },
        productDetails: [
            {
                productgroup: { type: String, required: true },
                product: { type: String, required: true },
                quantity: { type: String, required: true }
            }
        ],
        salegroup: { type: String, enum: ["SAO", "SGO"], },
        shippingcharge: { type: String, required: true },
        netamount: { type: String, required: true },
        remarks: { type: String, },
        status: { type: Boolean, required: true, default: false },
        deliver: { type: Boolean, required: true, default: false },
        deliverdate: { type: Date, },
        totalsp: { type: String, required: true },
        defaultdata: { type: String, required: true, default: "Order" }

    },
    { timestamps: true }
);

OrderSchema.pre("save", async function (next) {
    if (this.isNew) {
        const orders = await mongoose.model("Orders1111").find({});
        let maxOrder = 0;

        for (const order of orders) {
            const num = parseInt(order.orderNo, 10);
            if (!isNaN(num) && num > maxOrder) {
                maxOrder = num;
            }
        }

        this.orderNo = (maxOrder + 1).toString();
    }
    next();
});
const OrderModel =
    mongoose.models.Orders1111 || mongoose.model("Orders1111", OrderSchema);

export default OrderModel