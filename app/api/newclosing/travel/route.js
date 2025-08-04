import dbConnect from "@/lib/dbConnect";
import TravelfundModel from "@/model/travelfund";
import UserModel from "@/model/User";

export async function POST(req) {
  await dbConnect();

  try {
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

    for (const user of filteredUsers) {
      const saosp = Number(user.saosp || 0);
      const sgosp = Number(user.sgosp || 0);

      const lastMatchedSao = Number(user.travellastMatchedsao || 2000);
      const lastMatchedSgo = Number(user.travellastMatchedsgo || 1000);

      // Eligibility check: must have at least 2000 SAO SP and 1000 SGO SP
      if (saosp < 2000 || sgosp < 1000) continue;

      // Calculate new match based on increase since last matched
      const newMatchedSao = saosp - lastMatchedSao;
      const newMatchedSgo = sgosp - lastMatchedSgo;

      const newMatchingSP = Math.min(newMatchedSao, newMatchedSgo);

      if (newMatchingSP <= 0) continue;

      const originalAmount = newMatchingSP * 10;    // Example: 50 * 10 = 500
      const finalAmount = originalAmount * 0.95;    // 95% of original
      const charges = 0;                            // You mentioned charges = "0"
      const payamount = finalAmount * 0.15;         // 15% of final

      const closingEntry = new TravelfundModel({
        dsid: user.dscode,
        name: user.name || "N/A",
        acnumber: user.acnumber || "N/A",
        ifscCode: user.ifscCode || "N/A",
        bankName: user.bankName || "N/A",
        amount: finalAmount.toFixed(2),
        charges: charges.toFixed(2),
        payamount: payamount.toFixed(2),
        date: new Date().toISOString().split("T")[0],
      });

      await closingEntry.save();

      // Update last matched values
      await UserModel.updateOne(
        { _id: user._id },
        {
          $set: {
            travellastMatchedsao: String(saosp),
            travellastMatchedsgo: String(sgosp)
          }
        }
      );

      successfulPayouts++;
    }

    return new Response(
      JSON.stringify({
        message: `Travel fund process completed successfully. Payouts generated for ${successfulPayouts} users.`,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error generating travel fund:", error);
    return new Response(
      JSON.stringify({
        message: "Something went wrong during the travel fund process.",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
