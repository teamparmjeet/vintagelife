import dbConnect from "@/lib/dbConnect";
import ClosingHistoryModel from "@/model/ClosingHistory";
import UserModel from "@/model/User";

export async function POST(req) {
  await dbConnect();

  try {
    // Fetch all users from the database.
    const allUsers = await UserModel.find({});

    // Keep track of users who received a payout to show a summary.
    let successfulPayouts = 0;

    // Iterate over each user to check for potential payouts.
    for (const user of allUsers) {
      // Convert SP values from String to Number for calculations.
      // Default to 0 if a value is missing or invalid.
      const saosp = Number(user.saosp || 0);
      const sgosp = Number(user.sgosp || 0);
      const lastMatchedSP = Number(user.lastMatchedSP || 0);

      // Determine the total possible matching SP.
      const currentTotalMatch = Math.min(saosp, sgosp);

      // Calculate the new SP that has not been paid out yet.
      const newMatchingSP = currentTotalMatch - lastMatchedSP;

      // If there's no new matching SP, skip to the next user.
      if (newMatchingSP <= 0) {
        continue;
      }

      // Calculate the payout amounts based on the new matching SP.
      const totalAmount = newMatchingSP * 10;
      const charges = totalAmount * 0.05; // 5% charge
      const payamount = totalAmount - charges;

      // Create a new record for the closing history.
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

      // Save the new closing history record to the database.
      await closingEntry.save();

      // Update the user's record with the new total matched SP.
      // This prevents paying for the same SP again in the future.
      await UserModel.updateOne(
        { _id: user._id },
        { $set: { lastMatchedSP: String(currentTotalMatch) } }
      );
      
      successfulPayouts++;
    }

    // Return a success response.
    return new Response(
      JSON.stringify({
        message: `Closing process completed successfully. Payouts generated for ${successfulPayouts} users.`,
      }),
      { status: 200 }
    );

  } catch (error) {
    // Log the error for debugging purposes.
    console.error("Error generating closing history:", error);
    
    // Return a generic error response.
    return new Response(
      JSON.stringify({
        message: "Something went wrong during the closing process.",
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
