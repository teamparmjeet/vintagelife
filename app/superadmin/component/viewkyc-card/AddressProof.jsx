"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";

export default function AddressProof() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [addressproof, setAddressproof] = useState("");
    const [addressproofno, setAddressproofno] = useState("");
    const [addressproofimage, setAddressproofimage] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) return;
            try {
                const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
                if (response.data) {
                    setData(response.data);
                    setAddressproof(response.data.addressproof || "");
                    setAddressproofno(response.data.addressproofno || "");
                    setAddressproofimage(response.data.addressproofimage || "");
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setFetching(false);
            }
        };
        fetchUserData();
    }, [session?.user?.email]);

    const handleImageUpload = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await axios.post("/api/upload", formData);
            return response.data.file.secure_url;
        } catch (error) {
            console.error("Image upload failed:", error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.patch("/api/user/update-user", {
                id: session?.user?.id,
                addressproof,
                addressproofno,
                addressproofimage,
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update Proof details:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <p className="my-4 text-2xl font-light text-gray-700 dark:text-white/90">Address Proof</p>

                {fetching ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-300 rounded-md dark:bg-gray-700 w-3/4"></div>
                        <div className="h-12 bg-gray-300 rounded-md dark:bg-gray-700 w-full"></div>
                        <div className="h-40 bg-gray-300 rounded-md dark:bg-gray-700 w-full"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <p className="mb-2 text-md text-gray-500 dark:text-gray-400">Document Type</p>
                                <select
                                    value={addressproof}
                                    onChange={(e) => setAddressproof(e.target.value)}
                                    disabled={!isEditing}
                                    className="p-2 rounded-md text-md bg-black/10 text-gray-800 dark:text-white/90 border border-gray-300 dark:border-gray-700 w-full"
                                >
                                    <option value="">Select Document Type</option>
                                    <option value="Aadhar Card">Aadhar Card</option>
                                    <option value="Driving License">Driving License</option>
                                    <option value="Voter ID">Voter ID</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Electricity Bill">Electricity Bill</option>
                                </select>
                            </div>

                            <div className="col-span-1">
                                <p className="mb-2 text-md text-gray-500 dark:text-gray-400"> Document No</p>
                                <input
                                    type="text"
                                    value={addressproofno}
                                    onChange={(e) => setAddressproofno(e.target.value)}
                                    disabled={!isEditing}
                                    className="p-2 rounded-md text-md bg-black/10 text-gray-800 dark:text-white/90 border border-gray-300 dark:border-gray-700 w-full"
                                />
                            </div>


                            <div
                                className={`border border-gray-300 dark:border-gray-700 rounded-md p-4 flex items-center justify-center bg-black/10 dark:bg-gray-800 h-40 mt-4 overflow-hidden relative ${isEditing ? "cursor-pointer" : "cursor-default"
                                    }`}
                                onClick={() => isEditing && document.getElementById("proof-upload").click()}
                            >
                                {uploading ? (
                                    <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-full flex items-center justify-center">
                                        <p className="text-gray-500">Uploading...</p>
                                    </div>
                                ) : addressproofimage ? (
                                    <Image src={addressproofimage} alt="proof Card" layout="fill" objectFit="cover" className="rounded-md" />
                                ) : (
                                    <p className="text-gray-500">Click to upload</p>
                                )}
                            </div>

                            <input
                                type="file"
                                id="proof-upload"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const url = await handleImageUpload(file);
                                        if (url) setAddressproofimage(url);
                                    }
                                }}
                            />
                        </div>


                        <div className="mt-4 flex gap-4">
                            {isEditing ? (
                                <button
                                    className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50"
                                    onClick={handleSave}
                                    disabled={loading || uploading}
                                >
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            ) : (
                                <button className="bg-gray-700 text-white p-2 rounded-md" onClick={() => setIsEditing(true)}>
                                    Edit
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>


            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
                        <button className="absolute top-2 right-2 text-gray-600 dark:text-white" onClick={() => setIsModalOpen(false)}>
                            <X size={24} />
                        </button>
                        <Image src={addressproofimage || ""} alt="proof Card" width={500} height={300} className="rounded-md" />
                    </div>
                </div>
            )}
        </>
    );
}
