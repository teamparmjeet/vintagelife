import dbConnect from "@/lib/dbConnect";
import MonthlyClosingHistoryModel from "@/model/MonthleClosingHistory";
export const GET = async (request) => {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const dscode = searchParams.get("dscode");
  const date = searchParams.get("date");

 const filter = {
    invalidstatus: false,
    status: false,
  };

  // Optional: Filter by dscode
  if (dscode) filter.dsid = dscode;

  // Optional: Filter by specific date
  if (date) {
    const dateStart = new Date(date);
    const dateEnd = new Date(date);
    dateEnd.setDate(dateEnd.getDate() + 1);
    filter.createdAt = { $gte: dateStart, $lt: dateEnd };
  }

  try {
    const data = await MonthlyClosingHistoryModel.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await MonthlyClosingHistoryModel.countDocuments(filter);

    return Response.json(
      {
        message: "Data fetched successfully!",
        success: true,
        data,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching closing history:", error);
    return Response.json(
      { message: "Failed to fetch data", success: false },
      { status: 500 }
    );
  }
};
