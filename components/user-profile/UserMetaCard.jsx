"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";

// A small, reusable component for consistent styling of info pills.
const InfoPill = ({ label, value }) => (
    <div className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-200 font-medium px-3 py-1.5 rounded-full text-sm shadow-sm">
        <span className="font-semibold text-gray-800">{label}:</span> {value || "N/A"}
    </div>
);

// Reusable component for the KYC Status Badge
const KycBadge = ({ kyc }) => {
    if (kyc?.rejectedaadhar) {
        return <span className="text-red-600 dark:text-red-500 font-bold">Rejected</span>;
    }
    if (kyc?.aadharkkyc) {
        return <span className="text-green-600 dark:text-green-500 font-bold">Approved</span>;
    }
    return <span className="text-yellow-500 dark:text-yellow-400 font-bold">Pending</span>;
};

// Skeleton Loader Component
const UserMetaCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 animate-pulse">
            {/* Image Skeleton */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0"></div>

            {/* Text Skeleton */}
            <div className="flex-grow w-full space-y-4">
                {/* Name Skeleton */}
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/5"></div>
                {/* Pills Skeleton */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded-full w-24"></div>
                    <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded-full w-28"></div>
                </div>
            </div>

            {/* Button Skeletons */}
            <div className="flex flex-col sm:flex-row gap-3 self-stretch sm:self-center">
                <div className="w-24 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="w-20 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
        </div>
    </div>
);


export default function UserMetaCard() {
    const { data: session, update } = useSession();

    // State for data and loading indicators
    const [userData, setUserData] = useState(null);
    const [kycData, setKycData] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // State for modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // State for the edit form
    const [nameInput, setNameInput] = useState("");
    const [imageFile, setImageFile] = useState(null);

    // Fetch initial user and KYC data
    useEffect(() => {
        const fetchAllData = async () => {
            if (!session?.user?.email) return;

            setIsFetching(true);
            try {
                const userRes = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
                const fetchedUserData = userRes.data;

                if (fetchedUserData?.dscode) {
                    setUserData(fetchedUserData);
                    setNameInput(fetchedUserData.name); // Pre-fill form input

                    const kycRes = await axios.get(`/api/kyc/fetchsingle/${fetchedUserData.dscode}`);
                    setKycData(kycRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchAllData();
    }, [session?.user?.email]);

    // Memoize user role for performance
    const userRole = useMemo(() => {
        return { "0": "User", "1": "Admin", "2": "Superadmin" }[session?.user?.usertype] || "";
    }, [session?.user?.usertype]);

    // Handles the entire update process
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        let imageUrl = userData?.image || "";

        // Step 1: Upload image if a new one is selected
        if (imageFile) {
            try {
                const formData = new FormData();
                formData.append("file", imageFile);
                const uploadRes = await axios.post("/api/upload", formData);
                imageUrl = uploadRes.data.file.secure_url;
            } catch (error) {
                console.error("Image upload failed:", error);
                setIsUpdating(false);
                return;
            }
        }

        // Step 2: Update user data
        try {
            await axios.patch("/api/user/update-user", {
                id: session?.user?.id,
                name: nameInput,
                image: imageUrl,
            });

            // Step 3: Refresh local state and session without a page reload
            setUserData(prev => ({ ...prev, name: nameInput, image: imageUrl }));
            await update({ ...session, user: { ...session.user, name: nameInput, image: imageUrl } });

            // Cleanup and close modal
            setImageFile(null);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    // --- Skeleton loader integration ---
    if (isFetching) {
        return <UserMetaCardSkeleton />;
    }

    return (
        // Main container with theme-aware background, border, and text colors
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">

                {/* User Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 flex-shrink-0 shadow-lg">
                    <Image
                        width={112}
                        height={112}
                        src={userData?.image || "/images/user/icon-5359553_640.webp"}
                        alt="User Profile"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* User Details */}
                <div className="flex-grow text-center sm:text-left">
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {userData?.name || "Unknown User"}
                    </h4>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <InfoPill label="DSID" value={userData?.dscode} />
                        <InfoPill label="Sponsor ID" value={userData?.pdscode} />
                        {/* Themed KYC Badge container */}
                        <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium px-3 py-1.5 rounded-full text-sm shadow-sm">
                            <span className="font-semibold">KYC:</span> <KycBadge kyc={kycData} />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 self-stretch sm:self-center">
                   
                    <button
                        onClick={() => {
                            setNameInput(userData?.name); // Reset form state on open
                            setIsEditModalOpen(true);
                        }}
                        // Secondary action button with theme-aware colors
                        className="w-full sm:w-auto px-5 py-2 text-sm font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                        Edit
                    </button>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={() => setIsEditModalOpen(false)}>
                    <div
                        className="relative max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 className="mb-6 text-xl font-bold text-center text-gray-900 dark:text-white">
                            Edit Profile
                        </h4>
                        <form className="space-y-4" onSubmit={handleUpdateProfile}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    // Themed file input
                                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-blue-900/40 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" className="px-4 py-2 text-sm font-bold bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200" onClick={() => setIsEditModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50" disabled={isUpdating}>
                                    {isUpdating ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

           
        </div>
    );
}