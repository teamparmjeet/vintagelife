import dbConnect from "@/lib/dbConnect";
import KycModel from "@/model/KycStatus";
import UserModel from "@/model/User";

export async function POST(req, res) {
    await dbConnect();

    try {
        const users = await UserModel.find();
        console.log(users.lenght,"USer Length");
        for (const user of users) {
            const exists = await KycModel.findOne({ dscode: user.dscode });
            if (exists) continue;

            const isVerified = user.kycVerification?.isVerified || false;

            const kycEntry = new KycModel({
                dscode: user.dscode,
                bankkyc: isVerified,
                pankkyc: isVerified,
                aadharkkyc: isVerified,
                defaultdata: "kyc",
            });

            await kycEntry.save();
        }

        return Response.json({
            message: "KYC records created for all users",
            success: true,
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return Response.json({
            message: "Error processing KYC records",
            success: false,
        }, { status: 500 });
    }
}
