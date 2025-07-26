import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const GET = async (request) => {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // NEW: Get the dynamic search field and value
    const searchField = searchParams.get("searchField");
    const searchValue = searchParams.get("searchValue");
    const date = searchParams.get("date");

    const filter = {
        defaultdata: { $in: ["user",] },
        usertype: 1,
    };

    // NEW: Dynamically build the filter object
    // It will add the search condition only if both field and value are provided.
    if (searchField && searchValue) {
        // Use a case-insensitive regular expression for searching
        filter[searchField] = { $regex: searchValue, $options: 'i' };
    }

    // The date filter remains the same
    if (date) {
        const dateStart = new Date(date);
        const dateEnd = new Date(date);
        dateEnd.setDate(dateEnd.getDate() + 1);
        filter.createdAt = { $gte: dateStart, $lt: dateEnd };
    }

    try {
        const data = await UserModel.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await UserModel.countDocuments(filter);

        return Response.json(
            {
                message: "Data fetched successfully!",
                success: true,
                data,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        return Response.json(
            { message: "Failed to fetch data", success: false },
            { status: 500 }
        );
    }
};