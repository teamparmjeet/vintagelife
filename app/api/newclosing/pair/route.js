import dbConnect from "@/lib/dbConnect";
import ClosingHistoryModel from "@/model/ClosingHistory";
import UserModel from "@/model/User";

export async function POST(req) {
  await dbConnect();

  try {
    // Step 1: Get only users who have at least one SAO child and one SGO child
    const potentialUsers = await UserModel.find({});
    const filteredUsers = [];

    for (const user of potentialUsers) {
      const hasSAO = await UserModel.exists({ pdscode: user.dscode, group: "SAO" });
      const hasSGO = await UserModel.exists({ pdscode: user.dscode, group: "SGO" });

      if (hasSAO && hasSGO) {
        filteredUsers.push(user);
      }
    }

    let successfulPayouts = 0;

    // Step 2: Process only the filtered users
    for (const user of filteredUsers) {
      const saosp = Number(user.saosp || 0);
      const sgosp = Number(user.sgosp || 0);
      const lastMatchedSP = Number(user.lastMatchedSP || 0);

      const currentTotalMatch = Math.min(saosp, sgosp);
      const newMatchingSP = currentTotalMatch - lastMatchedSP;

      if (newMatchingSP <= 0) continue;

      const totalAmount = newMatchingSP * 10;
      const charges = totalAmount * 0.05;
      const payamount = totalAmount - charges;

      const closingEntry = new ClosingHistoryModel({
        dsid: user.dscode,
        name: user.name || "N/A",
        acnumber: user.acnumber || "N/A",
        ifscCode: user.ifscCode || "N/A",
        bankName: user.bankName || "N/A",
        amount: totalAmount,
        charges: charges.toFixed(2),
        payamount: payamount.toFixed(2),
        date: new Date().toISOString().split("T")[0],
      });

      await closingEntry.save();

      await UserModel.updateOne(
        { _id: user._id },
        { $set: { lastMatchedSP: String(currentTotalMatch) } }
      );

      successfulPayouts++;
    }

    return new Response(
      JSON.stringify({
        message: `Closing process completed successfully. Payouts generated for ${successfulPayouts} users.`,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error generating closing history:", error);

    return new Response(
      JSON.stringify({
        message: "Something went wrong during the closing process.",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
