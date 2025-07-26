import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/model/Order";
import mongoose from "mongoose";
import UserModel from "@/model/User";
import PaymentHistoryModel from "@/model/PaymentHistory";

export async function PATCH(req, { params }) {
    await dbConnect();

    try {
        const { id } = params;
        const data = await req.json();

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const updatedOrder = await OrderModel.findByIdAndUpdate(
                id,
                data,
                { new: true, session }
            );

            if (!updatedOrder) {
                await session.abortTransaction();
                session.endSession();
                return Response.json({
                    message: "Order not found",
                    success: false
                }, { status: 404 });
            }

            const user = await UserModel.findOne({
                dscode: updatedOrder.dscode
            }).session(session);

            if (user) {
                let currentEarnsp = parseFloat(user.earnsp) || 0;
                let currentSaosp = parseFloat(user.saosp) || 0;
                let currentSgosp = parseFloat(user.sgosp) || 0;
                const orderTotalSp = parseFloat(updatedOrder.totalsp) || 0;

                // ✅ APPROVE ORDER
                if (data.status === true && !data.cancelled) {
                    currentEarnsp += orderTotalSp;
                    if (updatedOrder.salegroup === "SAO") currentSaosp += orderTotalSp;
                    else if (updatedOrder.salegroup === "SGO") currentSgosp += orderTotalSp;

                    await UserModel.updateOne(
                        { dscode: updatedOrder.dscode },
                        {
                            earnsp: currentEarnsp.toString(),
                            saosp: currentSaosp.toString(),
                            sgosp: currentSgosp.toString()
                        },
                        { session }
                    );

                    await PaymentHistoryModel.create([{
                        dsid: user.dscode,
                        dsgroup: user.group,
                        amount: "0",
                        sp: orderTotalSp.toString(),
                        group: updatedOrder.salegroup,
                        type: "order",
                        orderno: updatedOrder.orderNo,
                        referencename: user.dscode,
                        pairstatus: false,
                        monthlystatus: false,
                        defaultdata: "PaymentHistory",
                        levelname: "L0"
                    }], { session });

                    let currentParentCode = user.pdscode;
                    let childGroup = user.group;
                    let levelCounter = 1;

                    while (currentParentCode) {
                        const parent = await UserModel.findOne({ dscode: currentParentCode }).session(session);
                        if (!parent) break;

                        let updatedFields = {};
                        if (childGroup === "SAO") {
                            updatedFields.saosp = (parseFloat(parent.saosp) || 0) + orderTotalSp;
                        } else if (childGroup === "SGO") {
                            updatedFields.sgosp = (parseFloat(parent.sgosp) || 0) + orderTotalSp;
                        }

                        await UserModel.updateOne(
                            { dscode: parent.dscode },
                            {
                                ...(updatedFields.saosp !== undefined && { saosp: updatedFields.saosp.toString() }),
                                ...(updatedFields.sgosp !== undefined && { sgosp: updatedFields.sgosp.toString() }),
                            },
                            { session }
                        );

                        await PaymentHistoryModel.create([{
                            dsid: parent.dscode,
                            dsgroup: parent.group,
                            amount: "0",
                            sp: orderTotalSp.toString(),
                            group: childGroup,
                            type: "order",
                            orderno: updatedOrder.orderNo,
                            referencename: user.dscode,
                            pairstatus: false,
                            monthlystatus: false,
                            defaultdata: "PaymentHistory",
                            levelname: `L${levelCounter}`
                        }], { session });

                        childGroup = parent.group;
                        currentParentCode = parent.pdscode;
                        levelCounter++;
                    }

                }

                // ❌ CANCEL / UNAPPROVE ORDER
                else if (data.status === false || data.cancelled === true) {
                    currentEarnsp -= orderTotalSp;
                    if (updatedOrder.salegroup === "SAO") currentSaosp -= orderTotalSp;
                    else if (updatedOrder.salegroup === "SGO") currentSgosp -= orderTotalSp;

                    currentEarnsp = Math.max(currentEarnsp, 0);
                    currentSaosp = Math.max(currentSaosp, 0);
                    currentSgosp = Math.max(currentSgosp, 0);

                    await UserModel.updateOne(
                        { dscode: updatedOrder.dscode },
                        {
                            earnsp: currentEarnsp.toString(),
                            saosp: currentSaosp.toString(),
                            sgosp: currentSgosp.toString()
                        },
                        { session }
                    );

                    await PaymentHistoryModel.create([{
                        dsid: user.dscode,
                        dsgroup: user.group,
                        amount: "0",
                        sp: `-${orderTotalSp}`,
                        group: updatedOrder.salegroup,
                        type: "order-cancel",
                        orderno: updatedOrder.orderNo,
                        referencename: user.dscode,
                        pairstatus: false,
                        monthlystatus: false,
                        defaultdata: "PaymentHistory",
                        levelname: "L0"
                    }], { session });

                    let currentParentCode = user.pdscode;
                    let childGroup = user.group;
                    let levelCounter = 1;

                    while (currentParentCode) {
                        const parent = await UserModel.findOne({ dscode: currentParentCode }).session(session);
                        if (!parent) break;

                        let updatedFields = {};
                        if (childGroup === "SAO") {
                            updatedFields.saosp = Math.max((parseFloat(parent.saosp) || 0) - orderTotalSp, 0);
                        } else if (childGroup === "SGO") {
                            updatedFields.sgosp = Math.max((parseFloat(parent.sgosp) || 0) - orderTotalSp, 0);
                        }

                        await UserModel.updateOne(
                            { dscode: parent.dscode },
                            {
                                ...(updatedFields.saosp !== undefined && { saosp: updatedFields.saosp.toString() }),
                                ...(updatedFields.sgosp !== undefined && { sgosp: updatedFields.sgosp.toString() }),
                            },
                            { session }
                        );

                        await PaymentHistoryModel.create([{
                            dsid: parent.dscode,
                            dsgroup: parent.group,
                            amount: "0",
                            sp: `-${orderTotalSp}`,
                            group: childGroup,
                            type: "order-cancel",
                            orderno: updatedOrder.orderNo,
                            referencename: user.dscode,
                            pairstatus: false,
                            monthlystatus: false,
                            defaultdata: "PaymentHistory",
                            levelname: `L${levelCounter}`
                        }], { session });

                        childGroup = parent.group;
                        currentParentCode = parent.pdscode;
                        levelCounter++;
                    }
                }
            }

            await session.commitTransaction();
            session.endSession();

            return Response.json({
                message: "Order updated successfully",
                success: true,
                data: updatedOrder
            }, { status: 200 });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Transaction error:", error);
            return Response.json({
                message: "Transaction failed",
                success: false
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Outer error:", error);
        return Response.json({
            message: "Error updating order",
            success: false
        }, { status: 500 });
    }
}
