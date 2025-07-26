import dbConnect from "@/lib/dbConnect";
import MonthsModel from "@/model/3monthsboonanza";
import UserModel from "@/model/User";

export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json();

    // Get all users from the database
    const allUsers = await UserModel.find();

    // Format the users into the structure expected by UserDetails
    const userDetails = allUsers.map(user => ({
      dsid: user.dscode || "",
      userlevel: user.level || "",
      saosp: user.saosp || "",
      sgosp: user.sgosp || ""
    }));

    // Add the userDetails to the month data
    const newMonthData = new MonthsModel({
      ...data,
      UserDetails: userDetails
    });

    await newMonthData.save();

    return Response.json({
      message: "Month data registered with user details",
      success: true,
    }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({
      message: "Error in Month Registration",
      success: false
    }, { status: 500 });
  }
}
