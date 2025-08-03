import dbConnect from "@/lib/dbConnect";
import MonthlyClosingHistoryModel from "@/model/MonthleClosingHistory";
import ClosingHistoryModel from "@/model/ClosingHistory";
import TravelfundModel from "@/model/travelfund";

export const GET = async (request, { params }) => {
  await dbConnect();

  const dscode = params.dscode;
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Base filter
  const baseFilter = {
    dsid: dscode,
    status: true,
  };

  // If date range provided, add it to filter
  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    baseFilter.statusapprovedate = {
      $gte: start,
      $lte: end,
    };
  }

  try {
    // Monthly Closing History
    const monthlyData = await MonthlyClosingHistoryModel.find({
      ...baseFilter,
      defaultdata: "monthlyHistory",
    }).sort({ statusapprovedate: -1 });

    // Closing History
    const closingData = await ClosingHistoryModel.find(baseFilter).sort({
      statusapprovedate: -1,
    });

    // Travel Fund
    const travelFundData = await TravelfundModel.find(baseFilter).sort({
      statusapprovedate: -1,
    });

    return Response.json({
      message: "Data fetched successfully!",
      success: true,
      monthlyData,
      closingData,
      travelFundData,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return Response.json(
      { message: "Failed to fetch data", success: false },
      { status: 500 }
    );
  }
};
