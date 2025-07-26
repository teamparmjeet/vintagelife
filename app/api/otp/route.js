import nodemailer from "nodemailer";

const otpStorage = {}; // Temporary in-memory storage for OTPs

// Send OTP to email
export const POST = async (req) => {
  const { email, otp } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ success: false, message: "Email is required" }), {
      status: 400,
    });
  }

  if (otp) {
    // Verify OTP
    if (otpStorage[email] && otpStorage[email] === parseInt(otp)) {
      delete otpStorage[email]; // Clear OTP after successful verification
      return new Response(JSON.stringify({ success: true, message: "OTP verified." }), {
        status: 200,
      });
    }
    return new Response(JSON.stringify({ success: false, message: "Invalid or expired OTP." }), {
      status: 400,
    });
  }

  // Generate and send OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  otpStorage[email] = generatedOtp; // Store OTP temporarily for verification

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Net Market Verification",
      text: `Your One-Time Password (OTP) is ${generatedOtp}. Please use this code within the next 5 minutes to complete your verification process.`,
    });

    return new Response(JSON.stringify({ success: true, message: "OTP sent to email." }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return new Response(JSON.stringify({ success: false, message: "Failed to send OTP." }), {
      status: 500,
    });
  }
};
