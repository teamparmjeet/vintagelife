import dbConnect from "@/lib/dbConnect";
import ClosingHistoryModel from "@/model/ClosingHistory";
import MonthlyClosingHistoryModel from "@/model/MonthleClosingHistory";

export const GET = async (request, { params }) => {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const dscode = params.dsid;

  const filter = {
    dsid: dscode,
    status: true,
  };

  try {
    // Fetch both datasets
    const closingHistory = await ClosingHistoryModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const monthlyHistory = await MonthlyClosingHistoryModel.find(filter)
      .sort({ createdAt: -1 });

    // Merge both arrays
    const combinedData = [...closingHistory, ...monthlyHistory];

    const total = await ClosingHistoryModel.countDocuments(filter);
    const totalMonthly = await MonthlyClosingHistoryModel.countDocuments(filter);
    const totalCombined = total + totalMonthly;

    return Response.json({
      message: "Data fetched successfully!",
      success: true,
      data: combinedData,
      total: totalCombined,
      currentPage: page,
      totalPages: Math.ceil(total / limit), // based on closingHistory pagination
    });
  } catch (error) {
    console.error("Error fetching combined history:", error);
    return Response.json(
      { message: "Failed to fetch data", success: false },
      { status: 500 }
    );
  }
};
