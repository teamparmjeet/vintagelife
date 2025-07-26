"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

// Reusable component for displaying a detail field
const DetailField = ({ label, value }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400">
            {label}
        </label>
        <div className="mt-1 px-3 py-2 text-sm rounded-md bg-gray-50 dark:bg-gray-800 border text-gray-500 dark:text-gray-100 border-gray-200 dark:border-gray-700 min-h-[38px]">
            {value || <span className="text-gray-400 dark:text-gray-500">N/A</span>}
        </div>
    </div>
);

// Skeleton loader for the nominee details card
const NomineeDetailsSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm animate-pulse">
        <div className="flex justify-between items-center mb-6">
            <div className="h-6 rounded bg-gray-200 dark:bg-gray-700 w-1/3"></div>
            <div className="h-10 rounded-lg bg-gray-200 dark:bg-gray-700 w-20"></div>
        </div>
        {/* Skeleton sections for different details */}
        {[3, 3, 2].map((fieldCount, sectionIndex) => (
            <div key={sectionIndex} className="mt-6">
                <div className="h-5 rounded bg-gray-200 dark:bg-gray-700 w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: fieldCount }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 rounded bg-gray-200 dark:bg-gray-700 w-1/2"></div>
                            <div className="h-9 rounded bg-gray-200 dark:bg-gray-700 w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);


export default function NomineeDetails() {
    const { data: session, update } = useSession();
    const [data, setData] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        nomineeName: "", nomineeRelation: "", nomineeDOB: "", nomineebankName: "",
        nomineeacnumber: "", nomineeifscCode: "", nomineePanNo: "", nomineeAadharNo: ""
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
                    const dobForInput = userData.nomineeDOB ? new Date(userData.nomineeDOB).toISOString().split('T')[0] : "";
                    setFormData({
                        nomineeName: userData.nomineeName || "",
                        nomineeRelation: userData.nomineeRelation || "",
                        nomineeDOB: dobForInput,
                        nomineebankName: userData.nomineebankName || "",
                        nomineeacnumber: userData.nomineeacnumber || "",
                        nomineeifscCode: userData.nomineeifscCode || "",
                        nomineePanNo: userData.nomineeipanno || "",       // Handle inconsistent key from API
                        nomineeAadharNo: userData.nomineeiaadharno || "", // Handle inconsistent key from API
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
            // Map form state back to the original database keys for the PATCH request
            const payload = {
                id: data._id,
                nomineeName: formData.nomineeName,
                nomineeRelation: formData.nomineeRelation,
                nomineeDOB: formData.nomineeDOB,
                nomineebankName: formData.nomineebankName,
                nomineeacnumber: formData.nomineeacnumber,
                nomineeifscCode: formData.nomineeifscCode,
                nomineeipanno: formData.nomineePanNo,       // Map back to original key
                nomineeiaadharno: formData.nomineeAadharNo,  // Map back to original key
            };
            await axios.patch("/api/user/update-user", payload);

            // Update local and session state without a page reload
            setData(prev => ({ ...prev, ...payload }));
            await update();
            setIsModalOpen(false);

        } catch (error) {
            console.error("Failed to update nominee details:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFetching) {
        return <NomineeDetailsSkeleton />;
    }

    const formFields = [
        { label: "Nominee Name", name: "nomineeName", type: "text" },
        { label: "Relation", name: "nomineeRelation", type: "select", options: ["", "Brother", "Father", "Friend", "Mother", "Wife", "Sister"] },
        { label: "DOB", name: "nomineeDOB", type: "date" },
        { label: "Bank Name", name: "nomineebankName", type: "text" },
        { label: "Account No", name: "nomineeacnumber", type: "number" },
        { label: "IFSC Code", name: "nomineeifscCode", type: "text" },
        { label: "PAN No", name: "nomineePanNo", type: "text" },
        { label: "Aadhar No.", name: "nomineeAadharNo", type: "number" },
    ];

    return (
        <div>
            <div className="bg-white dark:bg-gray-900 p-4 sm:p-6 border border-gray-200 dark:border-gray-800  shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        Nominee & KYC Details
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

                {/* Display Sections */}
                <div className="space-y-6">
                    <section>
                        <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Co-Applicant's/Nominee Details</h5>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailField label="Nominee Name" value={data?.nomineeName} />
                            <DetailField label="Relation" value={data?.nomineeRelation} />
                            <DetailField label="D.O.B." value={data?.nomineeDOB ? new Date(data.nomineeDOB).toLocaleDateString("en-GB") : ""} />
                        </div>
                    </section>
                    <section>
                        <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Payment Details</h5>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailField label="Bank Name" value={data?.nomineebankName} />
                            <DetailField label="Account No" value={data?.nomineeacnumber} />
                            <DetailField label="IFSC Code" value={data?.nomineeifscCode} />
                        </div>
                    </section>
                    <section>
                        <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">KYC Details</h5>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailField label="PAN No" value={data?.nomineeipanno} />
                            <DetailField label="Aadhar No" value={data?.nomineeiaadharno} />
                        </div>
                    </section>
                </div>
            </div>

            {/* Modal for Editing */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4" onClick={() => setIsModalOpen(false)}>
                    <div className="relative max-w-2xl w-full bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                        <h4 className="mb-6 text-xl font-bold text-center text-gray-900 dark:text-white">
                            Edit Nominee Information
                        </h4>
                        <form onSubmit={handleUpdate}>
                            <div className="max-h-[60vh] overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {formFields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {field.label}
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