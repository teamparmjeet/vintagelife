import dbConnect from "@/lib/dbConnect";
import TravelfundModel from "@/model/travelfund";
import UserModel from "@/model/User";

export async function POST(req) {
  await dbConnect();

  try {
    const allUsers = await UserModel.find({ activesp: "100" });

    let successfulPayouts = 0;

    for (const user of allUsers) {
      const saosp = Number(user.saosp || 0);
      const sgosp = Number(user.sgosp || 0);
      const travellastMatchedSP = Number(user.travellastMatchedSP || 0);

      const currentTotalMatch = Math.min(saosp, sgosp);
      const newMatchingSP = currentTotalMatch - travellastMatchedSP;

      if (newMatchingSP <= 0) continue;

      const originalAmount = newMatchingSP * 10;        // e.g., 600
      const finalAmount = originalAmount * 0.95;        // 570
      const charges = finalAmount * 0.05;               // 28.5
      const payamount = finalAmount * 0.15;             // 85.5

      const closingEntry = new TravelfundModel({
        dsid: user.dscode,
        name: user.name || "N/A",
        acnumber: user.acnumber || "N/A",
        ifscCode: user.ifscCode || "N/A",
        bankName: user.bankName || "N/A",
        amount: finalAmount.toFixed(2),                 // amount = 570
        charges: "0",                    // 5% of 570
        payamount: payamount.toFixed(2),                // 15% of 570
        date: new Date().toISOString().split("T")[0],
      });

      await closingEntry.save();

      await UserModel.updateOne(
        { _id: user._id },
        { $set: { travellastMatchedSP: String(currentTotalMatch) } }
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
