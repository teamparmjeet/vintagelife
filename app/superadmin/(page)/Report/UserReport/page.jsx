"use client";
import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import Link from "next/link";

export default function Page() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dscode, setDscode] = useState("");
    const [date, setDate] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/user/fetch/user", {
                params: {
                    page,
                    limit: 20,
                    dscode: dscode || undefined,
                    date: date || undefined,
                },
            });
            setData(response.data.data || []);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to load data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const handleFilter = () => {
        setPage(1);
        fetchData();
    };

    const handleClear = () => {
        setDscode("");
        setDate("");
        setPage(1);
        fetchData();
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto  textb">
            <h2 className="text-3xl font-bold text-center mb-6 textn">User Report</h2>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by DS Code"
                    value={dscode}
                    onChange={(e) => setDscode(e.target.value)}
                    className="px-4 py-2 rounded-md bordernormal bg-white textb focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color-navy"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="px-4 py-2 rounded-md bordernormal bg-white textb focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-color-navy"
                />
                <button
                    onClick={handleFilter}
                    className="bgn textw px-4 py-2 rounded-md font-semibold hbgb"
                >
                    Filter
                </button>
                <button
                    onClick={handleClear}
                    className="bgg textn px-4 py-2 rounded-md font-semibold hbgb"
                >
                    Remove Filter
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-10 bgg rounded-md animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <p className="text-center text-red-600 font-bold py-8 text-lg">{error}</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg shadow-md bordernormal">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bgn textw uppercase">
                                <tr>
                                    <th className="px-4 py-3">DS Code</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Group</th>
                                    <th className="py-3 px-4">Current Level</th>
                                    <th className="py-3 px-4">Active Sp</th>
                                    <th className="py-3 px-4">Kyc Status</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Register Date</th>
                                    <th className="px-4 py-3">Activate Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((user, index) => (
                                    <Fragment key={index}>
                                        <tr className={`${index % 2 === 0 ? "bg-slate-50" : "bg-gray-50"}`}>
                                            <td className="px-4 py-3 font-medium textb">{user.dscode}</td>
                                            <td className="px-4 py-3 textn">{user.name}</td>
                                            <td className="px-4 py-3 textn">{user.email}</td>
                                            <td className="px-4 py-3 textn">{user.group}</td>
                                            <td className="py-3 px-4 textb">{user.level || "N/A"}</td>
                                            <td className="py-3 px-4 textb">{user.activesp || "N/A"}</td>
                                            <td className="py-3 px-4 font-semibold">{user.kycVerification.isVerified ? "Verified" : "Not Verified"}</td>
                                            <td className={`px-4 py-3 font-bold ${user.usertype === "1" ? "text-green-700" : "text-red-700"}`}>
                                                {user.usertype === "1" ? "Active" : "Inactive"}
                                            </td>
                                            <td className="px-4 py-3 textn">{new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                                            <td className="px-4 py-3 textn">
                                                {user.activedate ? new Date(user.activedate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "N/A"}
                                            </td>
                                        </tr>
                                        <tr className={`${index % 2 === 0 ? "bgw" : "bgg"}`}>
                                            <td colSpan="10" className="px-4 pb-3 text-right space-x-4">
                                                <Link href={`/superadmin/Report/allreport/${user.dscode}`} className="textn font-semibold hover:underline">
                                                    All Report
                                                </Link>
                                                <Link href={`/superadmin/Report/UserReportcom/${user.dscode}`} className="textn font-semibold hover:underline">
                                                    Order Report
                                                </Link>
                                                <Link href={`/superadmin/Report/UserReportChain/${user.dscode}`} className="textn font-semibold hover:underline">
                                                    Chain Report
                                                </Link>
                                            </td>
                                        </tr>
                                    </Fragment>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan="10" className="text-center py-8 textb font-medium">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center mt-8 gap-4">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                            className="bgn textw px-4 py-2 rounded-md font-semibold hbgb disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>
                        <span className="font-bold textn">{`Page ${page} of ${totalPages}`}</span>
                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                            className="bgn textw px-4 py-2 rounded-md font-semibold hbgb disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}