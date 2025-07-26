"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    const [data, setData] = useState([]);
    const [dscode, setDscode] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const fetchData = async (page = 1, dscode = "") => {
        try {
            setLoading(true);
            const res = await axios.post("/api/kyc/pendingkyc/aadhar", { page, dscode });
            setData(res.data.users);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page, dscode);
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchData(1, dscode);
    };

    return (
        <div className="">
            <h1 className="text-xl md:text-2xl font-bold mb-4">Pending Aadhar KYC Users</h1>

            <form
                onSubmit={handleSearch}
                className="mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center"
            >
                <input
                    type="text"
                    value={dscode}
                    onChange={(e) => setDscode(e.target.value)}
                    placeholder="Search by DS Code"
                    className="border px-3 py-2 rounded w-full sm:w-60"
                />
                <button
                    type="submit"
                    className="bgn text-white px-4 py-2 rounded hbgb w-full sm:w-auto"
                >
                    Search
                </button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-3 py-2 text-left">Sr.</th>
                                    <th className="border px-3 py-2 text-left">DS Code</th>
                                    <th className="border px-3 py-2 text-left">Name</th>
                                    <th className="border px-3 py-2 text-left">Aadhar Number</th>
                                    <th className="border px-3 py-2 text-left">Aadhar Name</th>
                                    <th className="border px-3 py-2 text-left">Aadhar Image</th>
                                    <th className="border px-3 py-2 text-left">Comment</th>
                                    <th className="border px-3 py-2 text-left">Action</th>
                                    {/* <th className="border px-3 py-2 text-left">Edit</th> */}
                                    <th className="border px-3 py-2 text-left">View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    data.map((user, index) => (
                                        <tr key={user._id} className="odd:bg-slate-50 even:bg-gray-50">
                                            <td className="border px-3 py-2">{(page - 1) * 20 + index + 1}</td>
                                            <td className="border px-3 py-2">{user.dscode}</td>
                                            <td className="border px-3 py-2">{user.name}</td>
                                            <td className="border px-3 py-2">{user.aadharno || "-"}</td>
                                            <td className="border px-3 py-2">{user.aadharfullname || "-"}</td>
                                            <td className="border px-3 py-2">
                                                {user.aadharimage ? (
                                                    <div className="w-12 h-12 overflow-hidden border border-gray-300">
                                                        <Link href={user.aadharimage} target="_blank">
                                                            <Image
                                                                src={user.aadharimage}
                                                                alt="aadharimage"
                                                                width={48}
                                                                height={48}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">N/A</span>
                                                )}
                                            </td>


                                            <td className="border px-3 py-2">
                                                <input
                                                    type="text"
                                                    className="border px-2 py-1 rounded w-full text-sm"
                                                    placeholder="Enter comment"
                                                    value={user.aadharresn || ""}
                                                    onChange={(e) => {
                                                        const updated = data.map(u =>
                                                            u._id === user._id ? { ...u, aadharresn: e.target.value, isCommentChanged: true } : u
                                                        );
                                                        setData(updated);
                                                    }}
                                                />
                                                {user.isCommentChanged && (
                                                    <button
                                                        className="bg-blue-500 text-white text-xs px-2 py-1 rounded mt-1 hover:bg-blue-600"
                                                        onClick={async () => {
                                                            const confirm = window.confirm("Update comment?");
                                                            if (!confirm) return;
                                                            try {
                                                                setLoading(true);
                                                                await axios.patch("/api/kyc/update", {
                                                                    dscode: user.dscode,
                                                                    aadharresn: user.aadharresn,
                                                                });
                                                                alert("Comment updated.");
                                                                const updated = data.map(u =>
                                                                    u._id === user._id ? { ...u, isCommentChanged: false } : u
                                                                );
                                                                setData(updated);
                                                            } catch (err) {
                                                                alert("Failed to update comment.");
                                                                console.error(err);
                                                            } finally {
                                                                setLoading(false);
                                                            }
                                                        }}
                                                    >
                                                        Update
                                                    </button>
                                                )}
                                            </td>

                                            <td className="border px-3 py-2 space-y-1">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={async () => {
                                                            const confirm = window.confirm("Approve KYC?");
                                                            if (!confirm) return;
                                                            try {
                                                                setLoading(true);
                                                                await axios.patch("/api/kyc/update", {
                                                                    dscode: user.dscode,
                                                                    aadharkkyc: true,
                                                                    rejectedaadhar: false,
                                                                    aadharresn: user.aadharresn || "",
                                                                });
                                                                alert("Approved successfully.");
                                                                await fetchData();
                                                            } catch (err) {
                                                                alert("Approval failed.");
                                                                console.error(err);
                                                            } finally {
                                                                setLoading(false);
                                                            }
                                                        }}
                                                        className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        onClick={async () => {
                                                            const confirm = window.confirm("Reject KYC?");
                                                            if (!confirm) return;
                                                            try {
                                                                setLoading(true);
                                                                await axios.patch("/api/kyc/update", {
                                                                    dscode: user.dscode,
                                                                    aadharkkyc: false,
                                                                    rejectedaadhar: true,
                                                                    aadharresn: user.aadharresn || "",
                                                                });
                                                                alert("Rejected successfully.");
                                                                await fetchData();
                                                            } catch (err) {
                                                                alert("Rejection failed.");
                                                                console.error(err);
                                                            } finally {
                                                                setLoading(false);
                                                            }
                                                        }}
                                                        className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>

                                            {/* <td className="border px-3 py-2">Edit</td> */}
                                            <td className="border px-3 py-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowModal(true);
                                                    }}
                                                    className="textn underline hover:text-blue-800"
                                                >
                                                    View
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="border px-3 py-2 text-center" colSpan="5">
                                            No data found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <button
                            disabled={page === pagination.totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}




            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] relative overflow-hidden">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl z-10"
                        >
                            &times;
                        </button>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-48px)]">
                            {/* Heading */}
                            <div className="pb-3 mb-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-800">User Personal Details</h2>
                            </div>

                            {/* User Info Table-like View */}
                            <div className="border rounded-lg overflow-hidden">
                                <div className="grid grid-cols-1 sm:grid-cols-2 border-t divide-x divide-y divide-gray-200 text-sm text-gray-700">
                                    <div className="bg-gray-50 px-4 py-2 font-semibold">DS Code</div>
                                    <div className="px-4 py-2">{selectedUser.dscode}</div>

                                    <div className="bg-gray-50 px-4 py-2 font-semibold">Name</div>
                                    <div className="px-4 py-2">{selectedUser.name}</div>

                                    <div className="bg-gray-50 px-4 py-2 font-semibold">Upline ID</div>
                                    <div className="px-4 py-2">{selectedUser.pdscode || "-"}</div>

                                    <div className="bg-gray-50 px-4 py-2 font-semibold">DOB</div>
                                    <div className="px-4 py-2">{selectedUser.dob || "N/A"}</div>

                                    <div className="bg-gray-50 px-4 py-2 font-semibold">Mobile No.</div>
                                    <div className="px-4 py-2">{selectedUser.mobileNo || "N/A"}</div>

                                    <div className="bg-gray-50 px-4 py-2 font-semibold">Email</div>
                                    <div className="px-4 py-2">{selectedUser.email || "N/A"}</div>

                                    <div className="bg-gray-50 px-4 py-2 font-semibold">Nominee Name</div>
                                    <div className="px-4 py-2">{selectedUser.nomineeName || "N/A"}</div>

                                    <div className="bg-gray-50 px-4 py-2 font-semibold">Nominee DOB</div>
                                    <div className="px-4 py-2">{selectedUser.nomineeDOB || "N/A"}</div>

                                    <div className="bg-gray-50 px-4 py-2 font-semibold">Nominee Relation</div>
                                    <div className="px-4 py-2">{selectedUser.nomineeRelation || "N/A"}</div>

                                    <div className="bg-gray-50 px-4 py-2 font-semibold">Address</div>
                                    <div className="px-4 py-2">
                                        {[selectedUser.address?.addressLine1, selectedUser.address?.addressLine2, selectedUser.address?.city, selectedUser.address?.landmark, selectedUser.address?.pinCode, selectedUser.address?.state]
                                            .filter(Boolean)
                                            .join(", ") || "N/A"}
                                    </div>

                                    <div className="bg-gray-50 px-4 py-2 font-semibold">Gender</div>
                                    <div className="px-4 py-2">{selectedUser.gender || "N/A"}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
