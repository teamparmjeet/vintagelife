"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

// Helper component to display info fields
const InfoField = ({ label, value, isRequired }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
            {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-1 px-3 py-2 text-sm rounded-md bg-gray-50 dark:bg-gray-800 border text-gray-500 dark:text-gray-100 border-gray-200 dark:border-gray-700 min-h-[38px]">
            {value || <span className="text-gray-400 dark:text-gray-500">N/A</span>}
        </div>
    </div>
);

// Skeleton loader that mimics the card's layout
const UserInfoCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm animate-pulse">
        <div className="h-6 rounded bg-gray-200 dark:bg-gray-700 w-1/3 mb-6"></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                    <div className="h-4 mb-2 rounded bg-gray-200 dark:bg-gray-700 w-1/2"></div>
                    <div className="h-9 rounded bg-gray-200 dark:bg-gray-700 w-full"></div>
                </div>
            ))}
        </div>
    </div>
);


export default function UserInfocard() {
    const { data: session, update } = useSession();
    const [data, setData] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state is kept separate for editing
    const [formData, setFormData] = useState({
        name: "", dob: "", mobileNo: "", fatherOrHusbandName: "",
        gender: "", profession: "", maritalStatus: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) return;
            setIsFetching(true);
            try {
                const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
                if (response.data?._id) {
                    const userData = response.data;
                    setData(userData);
                    // Format date for input[type=date] which requires YYYY-MM-DD
                    const dobForInput = userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : "";
                    setFormData({
                        name: userData.name || "",
                        dob: dobForInput,
                        mobileNo: userData.mobileNo || "",
                        fatherOrHusbandName: userData.fatherOrHusbandName || "",
                        gender: userData.gender || "",
                        profession: userData.profession || "",
                        maritalStatus: userData.maritalStatus || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchUserData();
    }, [session?.user?.email]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!data?._id) return;
        setIsSubmitting(true);
        try {
            await axios.patch("/api/user/update-user", { id: data._id, ...formData });

            // --- No Reload! Update state directly for a seamless experience ---
            setData(prev => ({ ...prev, ...formData }));
            await update(); // Refresh session data if needed
            setIsModalOpen(false); // Close modal on success

        } catch (error) {
            console.error("Failed to update user:", error);
            // Here you could set an error message state to display to the user
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFetching) {
        return <UserInfoCardSkeleton />;
    }

    // Definition for form fields to avoid repetition
    const formFields = [
        { label: "DS Name", name: "name", type: "text", isRequired: true },
        { label: "D.O.B.", name: "dob", type: "date" },
        { label: "Phone", name: "mobileNo", type: "tel" },
        { label: "Father's / Husband's Name", name: "fatherOrHusbandName", type: "text", isRequired: true },
        { label: "Gender", name: "gender", type: "select", options: ["", "Male", "Female", "Other"] },
        { label: "Profession", name: "profession", type: "select", options: ["", "SALARIED", "SELF-EMPLOYED", "STUDENT", "RETIRED", "OTHER"] },
        { label: "Marital Status", name: "maritalStatus", type: "select", options: ["", "Single", "Married", "Divorced", "Widowed"] },
    ];

    return (
        <div>
            {/* Main card uses a clean, theme-aware background */}
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border border-gray-200 dark:border-gray-800  shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        Personal Information
                    </h4>
                    {!isFetching && data?.status == 1 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
                        >
                            Edit
                        </button>
                    )}


                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoField label="DS Name" value={data?.name} isRequired />
                    <InfoField label="D.O.B." value={data?.dob ? new Date(data.dob).toLocaleDateString("en-GB") : ""} />
                    <InfoField label="Email address" value={data?.email} />
                    <InfoField label="Phone" value={data?.mobileNo} />
                    <InfoField label="Father's / Husband's Name" value={data?.fatherOrHusbandName} isRequired />
                    <InfoField label="Gender" value={data?.gender} />
                    <InfoField label="Profession" value={data?.profession} />
                    <InfoField label="Marital Status" value={data?.maritalStatus} />
                </div>
            </div>

            {/* Modal for editing information */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="relative max-w-2xl w-full bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                        <h4 className="mb-6 text-xl font-bold text-center text-gray-900 dark:text-white">
                            Edit Personal Information
                        </h4>
                        <form onSubmit={handleUpdate}>
                            <div className="max-h-[60vh] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {formFields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                                        </label>
                                        {field.type === "select" ? (
                                            <select name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full px-4 py-2 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:outline-none">
                                                {field.options.map(opt => <option key={opt} value={opt}>{opt || `Select...`}</option>)}
                                            </select>
                                        ) : (
                                            <input type={field.type} name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full px-4 py-2 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:outline-none" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" className="px-4 py-2 text-sm font-bold bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                {/* Primary action button with a clear, theme-aware color */}
                                <button type="submit" className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}