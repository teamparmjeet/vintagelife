import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const ds = url.pathname.split("/").pop();

    if (!ds) {
      return Response.json(
        { message: "Invalid request! ds parameter is missing.", success: false },
        { status: 400 }
      );
    }

    const mainUser = await UserModel.findOne({ dscode: ds });
    if (!mainUser) {
      return Response.json(
        { message: "User not found!", success: false },
        { status: 404 }
      );
    }

    // Get all users in the system once
    const allUsers = await UserModel.find();

    // Build a map for quick lookup
    const userMap = new Map();
    for (const user of allUsers) {
      userMap.set(user.dscode, user);
    }

    // Build a map of parent to children
    const childrenMap = new Map();
    for (const user of allUsers) {
      if (!childrenMap.has(user.pdscode)) {
        childrenMap.set(user.pdscode, []);
      }
      childrenMap.get(user.pdscode).push(user);
    }

    // Iterative DFS to collect all descendants of mainUser
    const relatedUsers = [];
    const stack = [...(childrenMap.get(ds) || [])];

    while (stack.length > 0) {
      const current = stack.pop();
      relatedUsers.push(current);
      const children = childrenMap.get(current.dscode);
      if (children) stack.push(...children);
    }

    return Response.json(
      {
        success: true,
        mainUser,
        relatedUsers, // full chain of users under mainUser
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error on getting user:", error);
    return Response.json(
      { message: "Error on getting user!", success: false },
      { status: 500 }
    );
  }
}
