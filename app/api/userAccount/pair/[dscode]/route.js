import dbConnect from "@/lib/dbConnect";
import ClosingHistoryModel from "@/model/ClosingHistory";

export const GET = async (request, { params }) => {
  await dbConnect();

  const dscode = params.dscode;
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const filter = {
    dsid: dscode,
    status: true,
    defaultdata: "ClosingHistory",
  };

  if (startDate && endDate) {
    // Convert to UTC by adding timezone offset
    const start = new Date(startDate);
    start.setUTCHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    filter.statusapprovedate = {
      $gte: start,
      $lte: end,
    };
  }

  try {
    const data = await ClosingHistoryModel.find(filter).sort({
      statusapprovedate: -1,
    });

    return Response.json({
      message: "Data fetched successfully!",
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching ClosingHistory:", error);
    return Response.json(
      { message: "Failed to fetch data", success: false },
      { status: 500 }
    );
  }
};
