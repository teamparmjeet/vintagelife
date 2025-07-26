import dbConnect from "@/lib/dbConnect";
import KycModel from "@/model/KycStatus";

export async function GET(req, context) {
  await dbConnect();

  const params = await context.params;  // <-- await here
  const { dscode } = params;

  try {
    const kyc = await KycModel.findOne({ dscode });

    if (!kyc) {
      return new Response(JSON.stringify({ success: false, message: "KYC not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, data: kyc }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Server Error", error }), {
      status: 500,
    });
  }
}
