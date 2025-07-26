"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function Page() {
    const { data: session } = useSession();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchResult, setSearchResult] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) return;
            try {
                const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
                if (response.data) {
                    setData(response.data.dscode);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUserData();
    }, [session?.user?.email]);

    useEffect(() => {
        const handleSearch = async () => {
            if (!data) return;
            setLoading(true);
            setError(null);
            setSearchResult(null);

            try {
                const response = await axios.get(`/api/dscode/findtwobydscode/${data}`);
                if (response.data.success) {
                    setSearchResult({
                        user: response.data.mainUser, // Main user details
                        members: response.data.relatedUsers, // Downline members
                    });
                } else {
                    setError("No user found with this D.S. ID.");
                }
            } catch (err) {
                setError("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };
        handleSearch();
    }, [data]);

    return (
        <div className=" mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Downline Direct DS</h2>

            {/* Skeleton Loader */}
            {loading && (
                <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-6 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-6 bg-gray-200 rounded w-4/6"></div>
                </div>
            )}

            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Display Table */}
            {!loading && searchResult && (
                <div className="overflow-x-auto border border-gray-200 shadow-sm">
                    <table className="min-w-full bg-white border-collapse">
                        <thead className="bgn text-white text-sm uppercase sticky top-0">
                            <tr>
                                {[
                                    "S.No",
                                    "DS Code",
                                    "DS Name",
                                    "DOJ",
                                    "Sponsor DS Code",
                                    "Self SP",
                                    "Total SP",
                                    "Curr. Total SP",
                                    "Sale Group",
                                    "Curr. Self RSP",
                                    "Curr. Total RSP",
                                    "Status",
                                ].map((header, index) => (
                                    <th key={index} className="px-3 border border-gray-300 text-center">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Main User Row */}
                            {searchResult.user && (
                                <tr className="text-center bg-gray-100 font-semibold">
                                    <td className="p-3 border">1</td>
                                    <td className="p-3 border">{searchResult?.user?.dscode}</td>
                                    <td className="p-3 border">{searchResult?.user?.name}</td>
                                    <td className="p-3 border">{searchResult?.user?.createdAt ? new Date(searchResult.user?.createdAt).toLocaleDateString("en-GB") : "N/A"}</td>
                                    <td className="p-3 border">{searchResult?.user?.pdscode}</td>
                                    <td className="p-3 border">{searchResult?.user?.selfSp || "-"}</td>
                                    <td className="p-3 border">{searchResult?.user?.totalSp || "-"}</td>
                                    <td className="p-3 border">{searchResult?.user?.currTotalSp || "-"}</td>
                                    <td className="p-3 border">{searchResult?.user?.saleGroup || "-"}</td>
                                    <td className="p-3 border">{searchResult?.user?.currSelfRsp || "-"}</td>
                                    <td className="p-3 border">{searchResult?.user?.currTotalRsp || "-"}</td>
                                    <td className="p-3 border">
                                        {searchResult?.user?.usertype === "1" ? (
                                            <span className="text-green-600 font-semibold">Approved</span>
                                        ) : searchResult?.user?.usertype === "0" ? (
                                            <span className="text-yellow-500 font-semibold">Pending</span>
                                        ) : null}
                                    </td>

                                </tr>
                            )}

                            {/* Downline Members Rows */}
                            {searchResult.members?.map((member, index) => (
                                <tr key={index} className="text-center border-t">
                                    <td className="p-3 border">{index + 2}</td>
                                    <td className="p-3 border">{member?.dscode}</td>
                                    <td className="p-3 border">{member?.name}</td>
                                    <td className="p-3 border">{member?.createdAt ? new Date(member.createdAt).toLocaleDateString("en-GB") : "N/A"}</td>
                                    <td className="p-3 border">{member?.pdscode}</td>
                                    <td className="p-3 border">{member?.selfSp || "-"}</td>
                                    <td className="p-3 border">{member?.totalSp || "-"}</td>
                                    <td className="p-3 border">{member?.currTotalSp || "-"}</td>
                                    <td className="p-3 border">{member?.saleGroup || "-"}</td>
                                    <td className="p-3 border">{member?.currSelfRsp || "-"}</td>
                                    <td className="p-3 border">{member?.currTotalRsp || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            <p className="text-lg font-semibold text-gray-800 text-center mt-4">
                Total Direct Seller:{" "}
                <span className="text-blue-600">{searchResult?.members?.length + 1 || 0}</span>
            </p>


        </div>
    );
}
