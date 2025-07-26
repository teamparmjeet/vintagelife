import dbConnect from "@/lib/dbConnect";
import MonthsModel from "@/model/3monthsboonanza";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const ds = decodeURIComponent(params?.ds || "");

    const monthsData = await MonthsModel.find({ defaultdata: "months" });

    // Filter UserDetails for each month
    const filteredData = monthsData.map(month => {
      const filteredUsers = month.UserDetails.filter(user => user.dsid === ds);

      return {
        ...month._doc, // spread raw document data
        UserDetails: filteredUsers // replace with filtered users
      };
    });

    return Response.json(
      {
        message: "Data fetched successfully!",
        success: true,
        data: filteredData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error fetching data", error);
    return Response.json(
      {
        message: "Error fetching month data!",
        success: false,
      },
      { status: 500 }
    );
  }
}
