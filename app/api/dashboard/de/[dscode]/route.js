import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User"; // Your User model
import { NextResponse } from "next/server";

// Note: OrderModel is not explicitly used here, as the aggregation pipeline
// refers to the collection name ('orders1111') directly.
// import OrderModel from "@/model/Order";

export async function GET(request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    // Corrected the typo from search_params to searchParams
    const limit = parseInt(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    // This aggregation pipeline calculates SP from orders and fetches relevant users
    const aggregationPipeline = [
      // Stage 1: Find all inactive users (usertype: "0")
      {
        $match: {
          usertype: "0",
        },
      },
      // Stage 2: Perform a left join with the 'orders1111' collection
      {
        $lookup: {
          from: "orders1111", // The collection name for your OrderModel
          localField: "dscode", // Field from the users collection
          foreignField: "dscode", // Field from the orders1111 collection
          as: "orders", // The array of matching orders will be added as 'orders'
        },
      },
      // Stage 3: Calculate saosp and sgosp based on the user's approved orders
      {
        $addFields: {
          // Calculate the sum of 'totalsp' for orders with salegroup "SAO" and status: true
          saosp_calculated: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$orders",
                    as: "order",
                    cond: {
                      $and: [
                        { $eq: ["$$order.salegroup", "SAO"] },
                        { $eq: ["$$order.status", true] }, // <-- Only include approved orders
                      ],
                    },
                  },
                },
                as: "saoOrder",
                // Convert 'totalsp' from string to a number for calculation.
                in: { $toDouble: { $ifNull: ["$$saoOrder.totalsp", "0"] } },
              },
            },
          },
          // Calculate the sum of 'totalsp' for orders with salegroup "SGO" and status: true
          sgosp_calculated: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$orders",
                    as: "order",
                    cond: {
                      $and: [
                        { $eq: ["$$order.salegroup", "SGO"] },
                        { $eq: ["$$order.status", true] }, // <-- Only include approved orders
                      ],
                    },
                  },
                },
                as: "sgoOrder",
                in: { $toDouble: { $ifNull: ["$$sgoOrder.totalsp", "0"] } },
              },
            },
          },
        },
      },
      // Stage 4: Filter for users where at least one of the calculated SPs is greater than 0
      {
        $match: {
          $or: [
            { saosp_calculated: { $gt: 0 } },
            { sgosp_calculated: { $gt: 0 } },
          ],
        },
      },
      // Stage 5: Use $facet to handle pagination and get the total count efficiently
      {
        $facet: {
          // Sub-pipeline for the paginated data
          paginatedData: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              // Overwrite the original saosp and sgosp with the calculated values
              $addFields: {
                saosp: "$saosp_calculated",
                sgosp: "$sgosp_calculated",
              },
            },
            {
              // Remove the temporary fields used for calculation from the final output
              $project: {
                orders: 0,
                saosp_calculated: 0,
                sgosp_calculated: 0,
              },
            },
          ],
          // Sub-pipeline to get the total count of documents that match the filter
          totalCount: [
            {
              $count: "totalDocuments",
            },
          ],
        },
      },
    ];

    // Execute the aggregation pipeline
    const results = await UserModel.aggregate(aggregationPipeline);

    // Extract data from the facet result
    const users = results[0]?.paginatedData || [];
    const totalDocuments = results[0]?.totalCount[0]?.totalDocuments || 0;
    const totalPages = Math.ceil(totalDocuments / limit);

    return NextResponse.json({
      success: true,
      message: "Successfully fetched users with calculated SP from approved orders",
      data: users,
      totalPages: totalPages,
      currentPage: page,
      totalDocuments: totalDocuments,
    });
  } catch (error) {
    console.error("Error fetching inactive users with calculated SP:", error);
    return NextResponse.json(
      { message: "Error fetching data from the server", success: false },
      { status: 500 }
    );
  }
}