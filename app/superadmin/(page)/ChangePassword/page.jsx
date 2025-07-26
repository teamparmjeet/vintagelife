"use client";
import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
// import { useSession } from "next-auth/react";

export default function ChangePasswordPage() {
  // const { data: session, update } = useSession();
  // const email = session?.user?.email || "";
  const [formData, setFormData] = useState({
    dscode: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [step, setStep] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/otp", { email: formData.email });
      toast.success(response.data.message);
      // setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleOtpVerify = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error("OTP is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/otp", { email: formData.email, otp: formData.otp });
      toast.success(response.data.message);
      // setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!formData.password || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.patch("/api/user/changepasswordbyadmin", {
        dscode: formData.dscode,
        password: formData.password,
      });
      toast.success(response.data.message);
      // setStep(1);
      setFormData({ dscode: "", otp: "", password: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div className="flex justify-center items-center w-full">
     <div className="max-w-md w-full p-6 bgw">
      <Toaster />
      {/* <h2 className="text-2xl font-semibold mb-4 text-center">
        {step === 1 && "Verify Email"}
        {step === 2 && "Enter OTP"}
        {step === 3 && "Reset Password"}
      </h2> */}

      {/* {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleOtpVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )} */}

      {step === 3 && (
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="space-y-4">
               <div>
            <label className="block text-sm font-medium">Dscode</label>
            <input
              type="dscode"
              name="dscode"
              value={formData.dscode}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="bgn text-white px-4 py-2 rounded-lg hbgb w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      )}
    </div>
   </div>
  );
}