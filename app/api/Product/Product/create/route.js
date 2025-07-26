import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";

export async function POST(req, res) {
    await dbConnect();

    try {
        const data = await req.json();
        const newdata = new ProductModel(data);
        await newdata.save();

        return Response.json({
            message: "data Register",
            success: true,
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({
            message: "error in Order Registeration",
            success: false
        }, { status: 500 })
    }
}