import dbConnect from "@/lib/dbConnect";
import PaymentHistoryModel from "@/model/PaymentHistory";
import MonthlyClosingHistoryModel from "@/model/MonthleClosingHistory";
import UserModel from "@/model/User";

export async function POST(req) {
    await dbConnect();

    try {
        // Step 1: Find all PaymentHistory entries where monthlystatus is false
        const pendingPayments = await PaymentHistoryModel.find({ monthlystatus: false });

        // Step 2: Group payments by dsid and sum incomes
        const groupedPayments = {};

        for (const payment of pendingPayments) {
            const dsid = payment.dsid;

            if (!groupedPayments[dsid]) {
                groupedPayments[dsid] = {
                    payments: [],
                    totalPerformance: 0,
                    totalBonus: 0,
                };
            }

            groupedPayments[dsid].payments.push(payment);
            groupedPayments[dsid].totalPerformance += Number(payment.performance_income || 0);
            groupedPayments[dsid].totalBonus += Number(payment.bonus_income || 0);
        }

        // Step 3: Process each unique dsid
        for (const dsid in groupedPayments) {
            const { payments, totalPerformance, totalBonus } = groupedPayments[dsid];
            const totalIncome = totalPerformance + totalBonus;

            if (totalIncome <= 0) continue;

            const charges = totalIncome * 0.05;
            const payAmount = totalIncome - charges;

            // Mark all related payments as monthlystatus: true
            for (const payment of payments) {
                payment.monthlystatus = true;
                await payment.save();
            }

            // Get user details
            const user = await UserModel.findOne({ dscode: dsid });

            // Create monthly closing history entry
            const closingEntry = new MonthlyClosingHistoryModel({
                dsid,
                name: user?.name || "N/A",
                acnumber: user?.acnumber || "N/A",
                ifscCode: user?.ifscCode || "N/A",
                bankName: user?.bankName || "N/A",

                amount: String(totalIncome),
                charges: String(charges.toFixed(2)),
                payamount: String(payAmount.toFixed(2)),
                date: new Date().toISOString().split("T")[0], // current date
            });

            await closingEntry.save();
        }

        return new Response(JSON.stringify({ message: "Monthly closing history generated successfully." }), {
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: "Something went wrong.", error: error.message }), {
            status: 500,
        });
    }
}
