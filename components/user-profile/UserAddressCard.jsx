"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

// A reusable component for displaying each address field
const AddressField = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
            {label}
        </label>
        <div className="mt-1 px-3 py-2 text-sm rounded-md bg-gray-50 dark:bg-gray-800 border text-gray-500 dark:text-gray-100 border-gray-200 dark:border-gray-700 min-h-[38px]">
            {value || <span className="text-gray-400 dark:text-gray-500">N/A</span>}
        </div>
    </div>
);

// The new skeleton loader that mimics the address card's layout
const UserAddressCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm animate-pulse">
        <div className="h-6 rounded bg-gray-200 dark:bg-gray-700 w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Address Line Skeletons */}
            <div className="sm:col-span-2 h-9 rounded bg-gray-200 dark:bg-gray-700 w-full"></div>
            <div className="sm:col-span-2 h-9 rounded bg-gray-200 dark:bg-gray-700 w-full"></div>
            {/* Other Fields */}
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-1/2"></div>
                    <div className="h-9 rounded bg-gray-200 dark:bg-gray-700 w-full"></div>
                </div>
            ))}
        </div>
    </div>
);

export default function UserAddressCard() {
    const { data: session, update } = useSession();
    const [data, setData] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state for editing the address
    const [formData, setFormData] = useState({
        addressLine1: "", addressLine2: "", city: "",
        landmark: "", pinCode: "", state: "",
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
                    const address = userData.address || {};
                    setFormData({
                        addressLine1: address.addressLine1 || "",
                        addressLine2: address.addressLine2 || "",
                        city: address.city || "",
                        landmark: address.landmark || "",
                        pinCode: address.pinCode || "",
                        state: address.state || "",
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
            await axios.patch("/api/user/update-user", {
                id: data._id,
                address: formData,
            });

            // --- No Reload! Update state directly for a seamless experience ---
            setData(prev => ({ ...prev, address: formData }));
            await update();
            setIsModalOpen(false);

        } catch (error) {
            console.error("Failed to update user address:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFetching) {
        return <UserAddressCardSkeleton />;
    }

    // Definition for form fields to avoid repetition in the modal
    const formFields = [
        { label: "Address Line 1", name: "addressLine1", type: "text", fullWidth: true },
        { label: "Address Line 2", name: "addressLine2", type: "text", fullWidth: true },
        { label: "City", name: "city", type: "text" },
        { label: "Landmark", name: "landmark", type: "text" },
        { label: "Pin Code", name: "pinCode", type: "number" },
        { label: "State", name: "state", type: "text" },
    ];

    return (
        <div>
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border border-gray-200 dark:border-gray-800  shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        Address Information
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
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <AddressField label="Address Line 1" value={data?.address?.addressLine1} fullWidth />
                    <AddressField label="Address Line 2" value={data?.address?.addressLine2} fullWidth />
                    <AddressField label="City" value={data?.address?.city} />
                    <AddressField label="Landmark" value={data?.address?.landmark} />
                    <AddressField label="Pin Code" value={data?.address?.pinCode} />
                    <AddressField label="State" value={data?.address?.state} />
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="relative max-w-2xl w-full bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                        <h4 className="mb-6 text-xl font-bold text-center text-gray-900 dark:text-white">
                            Edit Address Information
                        </h4>
                        <form onSubmit={handleUpdate}>
                            <div className="max-h-[60vh] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {formFields.map((field) => (
                                    <div key={field.name} className={field.fullWidth ? "sm:col-span-2" : ""}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" className="px-4 py-2 text-sm font-bold bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
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