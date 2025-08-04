import dbConnect from "@/lib/dbConnect";
import MonthlyClosingHistoryModel from "@/model/MonthleClosingHistory";
import UserModel from "@/model/User";
import steppending from "@/constanst/StepPending";

export async function POST(req) {
  await dbConnect();

  try {
    const potentialUsers = await UserModel.find({});
    const filteredUsers = [];

    // Step 1: Filter users who have at least one SAO and one SGO child
    for (const user of potentialUsers) {
      const hasSAO = await UserModel.exists({ pdscode: user.dscode, group: "SAO" });
      const hasSGO = await UserModel.exists({ pdscode: user.dscode, group: "SGO" });

      if (hasSAO && hasSGO) {
        filteredUsers.push(user);
      }
    }

    let successfulPayouts = 0;

    // Step 2: Process eligible users
    for (const user of filteredUsers) {
      const saosp = Number(user.saosp || 0);
      const sgosp = Number(user.sgosp || 0);
      const lastMatchedLevel = user.monthlylastMatched || null;

      // Step 2.1: Find index of last matched level
      let lastIndex = -1;
      if (lastMatchedLevel) {
        lastIndex = steppending.findIndex((step) => step.level === lastMatchedLevel);
      }

      const nextIndex = lastIndex + 1;
      const nextLevel = steppending[nextIndex];
      if (!nextLevel) continue;

      // Step 2.2: Calculate cumulative SAO/SGO required up to next level
      const requiredSAO = steppending
        .slice(0, nextIndex + 1)
        .reduce((sum, level) => sum + level.sao, 0);
      const requiredSGO = steppending
        .slice(0, nextIndex + 1)
        .reduce((sum, level) => sum + level.sgo, 0);

      // Step 2.3: Check if user qualifies for next level cumulatively
      if (saosp >= requiredSAO && sgosp >= requiredSGO) {
        const bonusAmount = parseInt(nextLevel.bonus.replace(/[₹,]/g, ""), 10);
        const charges = bonusAmount * 0.05;
        const payamount = bonusAmount - charges;

        const closingEntry = new MonthlyClosingHistoryModel({
          dsid: user.dscode,
          name: user.name || "N/A",
          acnumber: user.acnumber || "N/A",
          ifscCode: user.ifscCode || "N/A",
          bankName: user.bankName || "N/A",
          amount: bonusAmount,
          charges: charges.toFixed(2),
          payamount: payamount.toFixed(2),
          date: new Date().toISOString().split("T")[0],
          level: nextLevel.level,
        });

        await closingEntry.save();

        // Step 2.4: Update last matched level
        await UserModel.updateOne(
          { _id: user._id },
          { $set: { monthlylastMatched: nextLevel.level } }
        );

        successfulPayouts++;
      }
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
