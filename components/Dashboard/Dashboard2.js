"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard2() {
    const { data: session } = useSession();
    const [userdata, setUserdata] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) return;
            try {
                const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
                setUserdata(response.data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [session?.user?.email]);

    return (
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-gray-900 rounded-lg shadow-md ">
                {/* Account Status */}
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-3">Account Status</h2>
                    {loading ? (
                        <SkeletonLoader />
                    ) : (
                        <>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Status:{" "}
                                <span className={`font-medium ${userdata?.usertype === "1" ? "text-green-600" : "text-red-600"}`}>
                                    {userdata?.usertype === "1" ? "Active" : "Deactive"}
                                </span>
                            </p>
                            {["KYC", "Bank KYC", "PHY KYC"].map((kyc, index) => (
                                <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                                    {kyc} Status:{" "}
                                    <Link href="/admin/Userprofile/viewkyc" className="text-blue-600 hover:underline">
                                        Click Here...
                                    </Link>
                                </p>
                            ))}
                        </>
                    )}
                </div>


                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-3">Financial Overview</h2>
                    {loading ? (
                        <SkeletonLoader />
                    ) : (
                        <>
                            <p className="text-sm text-gray-700 dark:text-gray-300">SAO SP: <span className=" text-gray-700 font-semibold ms-1">{userdata?.saosp || "0.00"}</span> </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">SGO SP: <span className=" text-gray-700 font-semibold ms-1">{userdata?.sgosp || "0.00"}</span> </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Monthly Sales Purchase SP: <span className="text-red-600 font-semibold">0.00</span>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const SkeletonLoader = () => (
    <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
);
