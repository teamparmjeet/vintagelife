import dbConnect from "@/lib/dbConnect";
import PaymentHistoryModel from "@/model/PaymentHistory";
import ClosingHistoryModel from "@/model/ClosingHistory";
import UserModel from "@/model/User";

function buildUserGraph(users) {
  const pdscodeToUsers = new Map();
  const dscodeToUser = new Map();

  for (const user of users) {
    if (!pdscodeToUsers.has(user.pdscode)) {
      pdscodeToUsers.set(user.pdscode, []);
    }
    pdscodeToUsers.get(user.pdscode).push(user);
    dscodeToUser.set(user.dscode, user);
  }

  return { pdscodeToUsers, dscodeToUser };
}

function traverseDownlines(startDs, pdscodeToUsers) {
  const queue = [{ ds: startDs, group: null }];
  const allDsCodes = new Set([startDs]);
  const saoDsCodes = new Set();
  const sgoDsCodes = new Set();
  const seen = new Set([startDs]);

  while (queue.length > 0) {
    const { ds, group } = queue.shift();
    const children = pdscodeToUsers.get(ds) || [];

    for (const user of children) {
      if (seen.has(user.dscode)) continue;
      seen.add(user.dscode);
      allDsCodes.add(user.dscode);

      let nextGroup = group;
      if (!group && (user.group === "SAO" || user.group === "SGO")) {
        nextGroup = user.group;
      }

      if (nextGroup === "SAO") saoDsCodes.add(user.dscode);
      else if (nextGroup === "SGO") sgoDsCodes.add(user.dscode);

      queue.push({ ds: user.dscode, group: nextGroup });
    }
  }

  return { allDsCodes, saoDsCodes, sgoDsCodes };
}

export async function POST(req) {
  await dbConnect();

  try {
    const allUsers = await UserModel.find().lean();
    const allPayments = await PaymentHistoryModel.find({ pairstatus: false }).lean();

    const { pdscodeToUsers, dscodeToUser } = buildUserGraph(allUsers);
    const paymentsByDsId = new Map();

    for (const payment of allPayments) {
      if (!paymentsByDsId.has(payment.dsid)) {
        paymentsByDsId.set(payment.dsid, []);
      }
      paymentsByDsId.get(payment.dsid).push(payment);
    }

    const successfulDsids = [];

    for (const user of allUsers) {
      const dsid = user.dscode;
      const { allDsCodes, saoDsCodes, sgoDsCodes } = traverseDownlines(dsid, pdscodeToUsers);

      const allRelevantPayments = Array.from(allDsCodes).flatMap(id => paymentsByDsId.get(id) || []);

      const saoDownlines = allRelevantPayments.filter(p => saoDsCodes.has(p.dsid));
      const sgoDownlines = allRelevantPayments.filter(p => sgoDsCodes.has(p.dsid));
      const mainUserPayments = paymentsByDsId.get(dsid) || [];

      for (const pay of mainUserPayments) {
        if (pay.group === "SAO") saoDownlines.unshift(pay);
        else if (pay.group === "SGO") sgoDownlines.unshift(pay);
      }

      const totalsaosp = saoDownlines.reduce((acc, cur) => acc + Number(cur.sp || 0), 0);
      const totalsgosp = sgoDownlines.reduce((acc, cur) => acc + Number(cur.sp || 0), 0);

      const matchingSP = Math.min(totalsaosp, totalsgosp);
      const totalAmount = matchingSP * 10;

      if (totalAmount <= 0) continue;

      successfulDsids.push(dsid);

      const charges = totalAmount * 0.05;
      const payamount = totalAmount - charges;

      const closingEntry = new ClosingHistoryModel({
        dsid,
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
    }

    await PaymentHistoryModel.updateMany(
      { dsid: { $in: successfulDsids }, pairstatus: false },
      { $set: { pairstatus: true } }
    );

    return new Response(
      JSON.stringify({ message: "Closing history created for users with amount > 0 and unpaid pairs only." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating closing history:", error);
    return new Response(JSON.stringify({ message: "Something went wrong.", error: error.message }), {
      status: 500,
    });
  }
}
