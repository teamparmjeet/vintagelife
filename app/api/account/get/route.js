import dbConnect from "@/lib/dbConnect";
import PaymentHistoryModel from "@/model/PaymentHistory";
import UserModel from "@/model/User";

async function getGroupedDsCodes(mainDs) {
    const allUsers = await UserModel.find().select("dscode pdscode group").lean();

    const graph = new Map();
    for (const user of allUsers) {
        if (!graph.has(user.pdscode)) graph.set(user.pdscode, []);
        graph.get(user.pdscode).push(user);
    }

    const saoDsCodes = new Set();
    const sgoDsCodes = new Set();
    const allDsCodes = new Set([mainDs]);
    const seen = new Set([mainDs]);

    const queue = [{ ds: mainDs, group: null }];

    while (queue.length > 0) {
        const { ds, group } = queue.shift();
        const children = graph.get(ds) || [];

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

    return {
        allDsCodes: Array.from(allDsCodes),
        saoDsCodes: Array.from(saoDsCodes),
        sgoDsCodes: Array.from(sgoDsCodes),
    };
}


export async function GET(req) {
   await dbConnect();

const url = new URL(req.url);
const page = parseInt(url.searchParams.get("page")) || 1;
// const limit = 20;
// const skip = (page - 1) * limit;

let dsid = url.searchParams.get("dsid") || "000001"; // Fallback to 000001
const type = url.searchParams.get("type");
const status = url.searchParams.get("status");
const closingstatus = url.searchParams.get("closingstatus");
const fromDate = url.searchParams.get("fromDate");
const toDate = url.searchParams.get("toDate");

const query = {};
let saoDownlines = [];
let sgoDownlines = [];

try {
    let saoDsCodes = [];
    let sgoDsCodes = [];

    const downlineData = await getGroupedDsCodes(dsid);
    query.dsid = { $in: downlineData.allDsCodes };
    saoDsCodes = downlineData.saoDsCodes;
    sgoDsCodes = downlineData.sgoDsCodes;

    if (type) query.type = type;
    if (status === "true") query.pairstatus = true;
    else if (status === "false") query.pairstatus = false;

     if (closingstatus === "true") query.monthlystatus = true;
    else if (closingstatus === "false") query.monthlystatus = false;

    if (fromDate && toDate) {
        query.createdAt = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate + "T23:59:59.999Z"),
        };
    }

    const totalDocs = await PaymentHistoryModel.countDocuments(query);
    // const totalPages = Math.ceil(totalDocs / limit);

    const data = await PaymentHistoryModel.find(query)
        .sort({ createdAt: -1 })
        // .skip(skip)
        // .limit(limit);

    const totals = await PaymentHistoryModel.aggregate([
        { $match: query },
        {
            $group: {
                _id: null,
                totalAmount: {
                    $sum: {
                        $convert: {
                            input: "$amount",
                            to: "double",
                            onError: 0,
                            onNull: 0,
                        },
                    },
                },
                totalBonus: {
                    $sum: {
                        $convert: {
                            input: "$bonus_income",
                            to: "double",
                            onError: 0,
                            onNull: 0,
                        },
                    },
                },
                totalPerformance: {
                    $sum: {
                        $convert: {
                            input: "$performance_income",
                            to: "double",
                            onError: 0,
                            onNull: 0,
                        },
                    },
                },
            },
        },
    ]);

    const { totalAmount = 0, totalBonus = 0, totalPerformance = 0 } = totals[0] || {};

    saoDownlines = data.filter(item => saoDsCodes.includes(item.dsid));
    sgoDownlines = data.filter(item => sgoDsCodes.includes(item.dsid));

    const mainUserPayments = data.filter(item => item.dsid === dsid);

    for (const pay of mainUserPayments) {
        if (pay.group === "SAO") {
            saoDownlines.unshift(pay);
        } else if (pay.group === "SGO") {
            sgoDownlines.unshift(pay);
        }
    }

    const totalsaosp = saoDownlines.reduce((acc, cur) => acc + Number(cur.sp || 0), 0);
    const totalsgosp = sgoDownlines.reduce((acc, cur) => acc + Number(cur.sp || 0), 0);
    const totalsp = totalsaosp + totalsgosp;

    return Response.json({
        success: true,
        data,
        // totalPages,
        totals: {
            totalsp,
            totalsaosp,
            totalsgosp,
            totalBonus,
            totalPerformance,
        },
        saoDownlines,
        sgoDownlines,
    });
} catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, message: "Something went wrong" }, { status: 500 });
}

}
