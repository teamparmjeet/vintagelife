import dbConnect from "@/lib/dbConnect"
import TravelfundModel from "@/model/travelfund";

export const GET = async (request) => {
  await dbConnect()

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const dscode = searchParams.get("dscode")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const filter = {
    status: true,
  }

  if (dscode) filter.dsid = dscode

  // Date range filter
 if (from && to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  toDate.setDate(toDate.getDate() + 1); // include 'to' date
  filter.statusapprovedate = { $gte: fromDate, $lt: toDate };
}


  try {
    const data = await TravelfundModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const total = await TravelfundModel.countDocuments(filter)

    return Response.json({
      message: "Data fetched successfully!",
      success: true,
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching closing history:", error)
    return Response.json(
      { message: "Failed to fetch data", success: false },
      { status: 500 }
    )
  }
}
