"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function UserVerify({ data }) {
    const [userData, setUserData] = useState(null);
    const [level, setLevel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [levelEdit, setLevelEdit] = useState(false);

    const [formData, setFormData] = useState({
        kycVerified: false,
        usertype: "0"
    });

    useEffect(() => {
        axios.get("/api/level/fetch/level")
            .then((response) => setLevel(response.data.data || []))
            .catch(() => setError("Failed to load levels."))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!data?.email) {
            setError("No email provided.");
            setLoading(false);
            return;
        }
        axios.get(`/api/user/find-admin-byemail/${data.email}`)
            .then(({ data }) => {
                setUserData(data);
                setFormData({
                    kycVerified: data.kycVerification?.isVerified || false,
                    usertype: data.usertype || "0"
                });
            })
            .catch((err) => setError(err.response?.data?.message || "Failed to load user data."))
            .finally(() => setLoading(false));
    }, [data?.email]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data: updatedData } = await axios.patch("/api/user/update-user/", {
                id: userData._id,
                kycVerification: { isVerified: formData.kycVerified },
                usertype: formData.usertype,
            });
            setUserData(updatedData);
            toast.success("User updated successfully!");
            setEditMode(false);
            setIsOpen(false);
            window.location.reload();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update user.");
        } finally {
            setLoading(false);
        }
    };

    const handleLevelUpdate = async (newLevel) => {
        try {
            setLoading(true);
            const { data: updatedData } = await axios.patch("/api/user/update-user/", {
                id: userData._id,
                level: newLevel
            });
            setUserData(updatedData);
            toast.success(`Level updated to ${newLevel}`);
            setLevelEdit(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update level.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-gray-500 text-center py-2 animate-pulse">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-2 bg-red-100 rounded">{error}</div>;

    return (
        <div className="w-full font-sans">
            <Toaster />
            <button
                onClick={() => setIsOpen(true)}
                className={`px-4 py-2 mt-2 text-white text-sm rounded-lg shadow-md transition-all ${userData?.usertype === "1" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            >
                {userData?.usertype === "1" ? "Active" : "DeActive"}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
                        <button
                            onClick={() => { setIsOpen(false); setEditMode(false); setLevelEdit(false); }}
                            className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-lg"
                        >
                            ✕
                        </button>

                        {editMode ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        name="kycVerified"
                                        checked={formData.kycVerified}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <label>KYC Verified</label>
                                </div>
                                <div>
                                    <label className="text-sm">Status</label>
                                    <select
                                        name="usertype"
                                        value={formData.usertype}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full border rounded p-2 text-sm mt-1"
                                    >
                                        <option value="0">Not Active</option>
                                        <option value="1">Active User</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700">
                                        Save
                                    </button>
                                    <button type="button" onClick={() => setEditMode(false)} className="flex-1 bg-gray-500 text-white py-2 rounded text-sm hover:bg-gray-600">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4 text-sm">
                                <p><strong>KYC:</strong> <span className={userData.kycVerification?.isVerified ? "text-green-600" : "text-red-600"}>{userData.kycVerification?.isVerified ? "Yes" : "No"}</span></p>
                                <p><strong>Status:</strong> <span className="text-blue-600">{userData.usertype === "1" ? "Allowed" : "Not Allowed"}</span></p>
                                <p>
                                    <strong>Level:</strong> <span className="text-blue-800">{userData.level || "Not Set"}</span>
                                    <button onClick={() => setLevelEdit(true)} className="ml-2 text-blue-500 underline text-xs">Update</button>
                                </p>
                                <button onClick={() => setEditMode(true)} className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
                                    Edit Status / KYC
                                </button>
                            </div>
                        )}

                        {levelEdit && (
                            <div className="mt-4 space-y-2">
                                <h3 className="text-sm font-medium text-gray-700">Select a new level:</h3>
                                {level.length > 0 ? (
                                    level.sort((a, b) => a.sao - b.sao).map((lvl, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleLevelUpdate(lvl.level_name)}
                                            disabled={userData.level === lvl.level_name || loading}
                                            className={`block w-full text-left px-4 py-2 border rounded hover:bg-blue-100 transition 
                                                ${userData.level === lvl.level_name ? "bg-blue-200 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                                        >
                                            {lvl.level_name}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-red-500">No levels found.</p>
                                )}
                                <button onClick={() => setLevelEdit(false)} className="text-sm text-gray-500 mt-2">Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
