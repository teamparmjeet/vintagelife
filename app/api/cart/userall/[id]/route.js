import dbConnect from "@/lib/dbConnect";
import CartModel from "@/model/Cart";

export async function GET(request, { params }) {
    await dbConnect();

    try {
        const id = decodeURIComponent(params?.id || "");

        const data = await CartModel.find({ dscode: id });

        if (!data.length) {
            return Response.json(
                {
                    message: "Data not found!",
                    success: false,
                },
                { status: 200 }
            );
        }

        return Response.json({ data, success: true }, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return Response.json(
            {
                message: "Error fetching data!",
                success: false,
            },
            { status: 500 }
        );
    }
}
