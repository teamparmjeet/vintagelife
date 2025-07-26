"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from 'react-hot-toast';

// A simple SVG icon for the delete button
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

// Loading skeleton component that mimics a table row
const TableSkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </td>
        <td className="p-4 text-right">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full inline-block"></div>
        </td>
    </tr>
);

export default function Page() {
    const [groupname, setGroupname] = useState("");
    const [productGroups, setProductGroups] = useState([]);
    const [loading, setLoading] = useState(false); // For form submission
    const [fetching, setFetching] = useState(true); // For initial data fetch

    useEffect(() => {
        fetchProductGroups();
    }, []);

    const fetchProductGroups = async () => {
        setFetching(true);
        try {
            const response = await axios.get("/api/Product/Group/fetch/s");
            setProductGroups(response.data.data || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch product groups.");
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedGroupName = groupname.trim();

        // --- VALIDATION CHECKS ---
        if (!trimmedGroupName) {
            toast.error("Group name cannot be empty.");
            return;
        }
        if (loading) return;

        // Check for duplicate names (case-insensitive)
        const isDuplicate = productGroups.some(
            (group) => group.groupname.toLowerCase() === trimmedGroupName.toLowerCase()
        );

        if (isDuplicate) {
            toast.error(`A group named "${trimmedGroupName}" already exists.`);
            return;
        }
        // --- END OF VALIDATION ---

        setLoading(true);
        // Optimistic UI update
        const tempId = `temp-${Date.now()}`;
        setProductGroups(prev => [{ _id: tempId, groupname: trimmedGroupName }, ...prev]);
        setGroupname("");

        try {
            const response = await axios.post("/api/Product/Group/create", { groupname: trimmedGroupName });
            toast.success(response.data.message || "Group added successfully.");
            // Replace optimistic data with actual data from server
            fetchProductGroups();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add group.");
            // Rollback on error
            setProductGroups(prev => prev.filter(g => g._id !== tempId));
            setGroupname(trimmedGroupName);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const originalGroups = [...productGroups];
        // Optimistic UI update
        setProductGroups(prev => prev.filter(group => group._id !== id));
        toast.success("Group removed.");
        
        try {
            await axios.delete(`/api/Product/Group/delete/${id}`);
        } catch (error) {
            // Rollback on error
            setProductGroups(originalGroups);
            toast.error(error.response?.data?.message || "Failed to delete group.");
        }
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Product Groups</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Create and manage your product categories.</p>
                    </header>

                    {/* Add Group Form */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
                            <input
                                type="text"
                                placeholder="Enter a new group name..."
                                value={groupname}
                                onChange={(e) => setGroupname(e.target.value)}
                                className="w-full flex-grow p-3 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-500 rounded-lg text-gray-800 dark:text-gray-200 focus:ring-0 focus:outline-none transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-6 py-3 bgn text-white font-semibold rounded-lg hbgb disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center flex-shrink-0"
                            >
                                {loading ? "Adding..." : "Add Group"}
                            </button>
                        </form>
                    </div>

                    {/* Product Groups Table */}
                    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Group Name</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetching ? (
                                    // Skeleton loading state
                                    [...Array(4)].map((_, i) => <TableSkeletonRow key={i} />)
                                ) : productGroups.length > 0 ? (
                                    // Data rows
                                    productGroups.map((group) => (
                                        <tr key={group._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{group.groupname}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(group._id)}
                                                    className="p-2 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 transition-all"
                                                    aria-label={`Delete ${group.groupname}`}
                                                >
                                                    <TrashIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    // Empty state
                                    <tr>
                                        <td colSpan="2" className="text-center py-16 px-6 text-gray-500 dark:text-gray-400">
                                            No product groups found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}