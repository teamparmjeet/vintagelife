"use client";
import React, { useState, useEffect } from 'react';
import Active from '@/components/Active/Active';
import { useSession } from "next-auth/react";
import axios from 'axios';

export default function Page() {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [kycData, setKycData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllData = async () => {
            if (!session?.user?.email) return;

            setIsLoading(true);
            setError("");

            try {
                // Fetch user data
                const userRes = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
                const fetchedUserData = userRes.data;
                setUserData(fetchedUserData);

                // Fetch KYC data using dscode
                if (fetchedUserData?.dscode) {
                    const kycRes = await axios.get(`/api/kyc/fetchsingle/${fetchedUserData.dscode}`);
                    setKycData(kycRes.data.data);
                } else {
                    setError("User DSCode not found.");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch user or KYC data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [session?.user?.email]);

    // Loading screen
    if (status === "loading" || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 text-lg">Loading...</p>
            </div>
        );
    }

    // If not authenticated
    if (!session) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">You are not authenticated.</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    // Still waiting for user or KYC data
    if (!userData || !kycData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-600 text-lg">Fetching your account details...</p>
            </div>
        );
    }

    // --- ✨ NEW LOGIC STARTS HERE ✨ ---

    // 1. Calculate if the account is older than one month.
    // IMPORTANT: Ensure the field name 'createdAt' matches your User model schema.
   const creationDate = userData?.createdAt ? new Date(userData.createdAt) : null;
let isExpired = false;

if (creationDate) {
    const oneMonthLater = new Date(creationDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    // Check if the current date has passed the one-month mark AND status is NOT 2
    isExpired = new Date() > oneMonthLater && userData?.status != 2;
}

    // 2. Original condition to show the <Active> component.
    const showActive = kycData?.aadharkkyc && userData?.usertype !== "1";

    // --- ✨ NEW LOGIC ENDS HERE ✨ ---


    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* First, check if the account activation period has expired.
              This check takes priority over the others.
            */}
            {isExpired ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-semibold mb-2">Activation Period Expired</h2>
                    <p>
                        Your account is more than one month old. You can no longer activate it yourself. Please contact an administrator for assistance.
                    </p>
                </div>
            ) : showActive ? (
                // If not expired and KYC is complete, show the activation component.
                <>
                    <Active userData={userData} />
                    {/* <p className="mt-6 text-green-700 bg-green-100 border border-green-300 px-4 py-3 rounded shadow">
                        ✅ Your KYC is complete. You can now activate your account.
                    </p> */}
                </>
            ) : (
                // If not expired but KYC is incomplete, show the KYC message.
                 <>
                    <Active userData={userData} />
                    {/* <p className="mt-6 text-green-700 bg-green-100 border border-green-300 px-4 py-3 rounded shadow">
                        ✅ Your KYC is complete. You can now activate your account.
                    </p> */}
                </>
            )}
        </div>
    );
}