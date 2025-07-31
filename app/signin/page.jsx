"use client";
import React, { useState } from "react";
import Input from "@/components/Input/Input";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, LockKeyholeIcon, KeyIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Signin() {
  const [formData, setFormData] = useState({ dsid: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");

const handleChange = (e) => {
  const { id, value } = e.target;
  setFormData((prevState) => ({
    ...prevState,
    [id]: id === "dsid" ? value.toUpperCase() : value,
  }));
};

  const isFormValid = () => {
    return formData.dsid.trim() !== "" && formData.password.trim() !== "";
  };

  const fetchUserData = async (dsid) => {
    try {
      const response = await axios.get(`/api/user/finduserbyid/${dsid}`);
      setEmail(response.data.email);
      setUser(response.data.defaultdata);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch user data. Please try again.");
      setLoading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const userData = await fetchUserData(formData.dsid);
      if (!userData) return;

      if (userData.defaultdata !== "user") {
        toast.error(
          <span>
            Your account is{" "}
            <strong style={{ color: "red", textTransform: "uppercase" }}>
              {userData.defaultdata}
            </strong>
            , please contact admin.
          </span>
        );
        return;
      }

      const res = await signIn("credentials", {
        email: userData.email,
        password: formData.password,
        redirect: false,
      });

      if (res.error) {
        toast.error("Invalid Credentials");
        return;
      }

      toast.success("Successfully signed in!");
      const userRoutes = {
        "2": "/superadmin",
        "1": "/admin",
        "0": "/user",
      };
      router.push(userRoutes[userData.usertype] || "/");
    } catch (error) {
      handleSignInError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInError = (error) => {
    if (axios.isAxiosError(error) && error.response) {
      toast.error(
        "Server error: " + (error.response.data.message || "An error occurred.")
      );
    } else {
      toast.error("Invalid Credentials. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bgw p-4">
      <Toaster />
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden bordernormal">
        {/* Left Side: Form */}
        <div className="w-full relative md:w-1/2 p-8 md:p-12 order-2 md:order-1 flex flex-col justify-center">
          <h2 className="text-center text-4xl font-bold textn mb-6">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col ">
            <div className="relative mb-2">
              <Input
                id="dsid"
                type="text"
                placeholder="DSID"
                icon={<LockKeyholeIcon size={18} className="textn" />}
                value={formData.dsid}
                onChange={handleChange}
                className="pl-8 uppercase w-full bgg textn placeholder-gray-500 focus:ring-navy focus:border-navy"
                required
                disabled={loading}
              />
            </div>
            <div className="relative mb-2">
              <Input
                id="password"
                type="password"
                icon={<KeyIcon size={18} className="textn" />}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="pl-8 w-full bgg textn placeholder-gray-500 focus:ring-navy focus:border-navy"
                required
                disabled={loading}
              />
            </div>
          
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bgn textw py-1 rounded-lg font-bold text-lg hbgb transition-all duration-300 ease-in-out disabled:bg-gray-400"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="text-center text-sm textn mt-4">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="font-bold hover:underline cursor-pointer">
                  Register Here
                </span>
              </Link>
            </p>
          </form>
            <div className=" absolute left-0 bottom-0">
              <p className=" text-xs bgn px-2 py-1 font-semibold rounded-tr-2xl text-white">Please contact Vintage support for password-related issues.</p>
            </div>
        </div>

        {/* Right Side: Image and Welcome Message */}
        <div className="w-full md:w-1/2  textw bgn hidden md:block items-center justify-center p-8 md:p-12 order-1 md:order-2 border-b-4 md:border-b-0 md:border-l-4 border-gray">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/logo/logonew.png"
                height={200}
                width={200}
                alt="Site Logo"
              />
            </div>
            <h1 className="text-4xl font-extrabold mb-2">Welcome Back!</h1>
            <p className="text-lg">
              Enter your credentials to access your account.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}