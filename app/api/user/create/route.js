import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

function generateRandomPassword(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function POST(req) {
    await dbConnect();

    try {
        const data = await req.json();

        if (!data.name || !data.email || !data.mobileNo || !data.group || !data.pdscode) {
            return new Response(
                JSON.stringify({ success: false, message: "All fields are required!" }),
                { status: 400 }
            );
        }

        const existingUser = await UserModel.findOne({
            $or: [
                { email: data.email },
                { mobileNo: data.mobileNo },
                ...(data.aadharno ? [{ aadharno: data.aadharno }] : [])
            ]
        }).lean();

        if (existingUser) {
            let message = "User already exists with ";
            if (existingUser.email === data.email) message += "this email!";
            else if (existingUser.mobileNo === data.mobileNo) message += "this mobile number!";
            else if (data.aadharno && existingUser.aadharno === data.aadharno) message += "this Aadhar number!";
            else message = "duplicate credentials.";

            return new Response(JSON.stringify({ success: false, message }), { status: 400 });
        }

        const referrerExists = await UserModel.findOne({ dscode: data.pdscode }).lean();
        if (!referrerExists) {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid referral code!" }),
                { status: 400 }
            );
        }

        const plainPassword = generateRandomPassword(10);
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const newUser = new UserModel({
            ...data,
            password: hashedPassword,
            plainpassword: plainPassword, // optional, if you store it (not recommended)
        });

        await newUser.save();

        return new Response(
            JSON.stringify({
                success: true,
                message: "User registered successfully",
                dscode: newUser.dscode,
                password: plainPassword, // send to frontend
            }),
            { status: 201 }
        );

    } catch (error) {
        console.error("User registration error:", error);

        if (error.name === "ValidationError") {
            return new Response(
                JSON.stringify({ success: false, message: "Invalid input data!" }),
                { status: 400 }
            );
        }

        return new Response(
            JSON.stringify({ success: false, message: "Internal server error. Try again later." }),
            { status: 500 }
        );
    }
}
