import dbConnect from "@/lib/dbConnect";
import AchiversModel from "@/model/Achivers";

export async function GET(request, context) {
    await dbConnect();

    try {
        const { params } = await context; 
        const type =  decodeURIComponent(params?.type);

       
        const data = await AchiversModel.find({ achivementtype1: type });

        if (!data.length) {
            return Response.json(
                {
                    message: "Data not found!",
                    success: false,
                },
                { status: 404 }
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
