"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Page() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/level/fetch/level");
                setData(response.data.data || []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please check your connection and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="">
            <div className="w-full">

                {loading ? (
                    <div className="h-96 flex flex-col gap-4 pt-4">
                        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                        <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                            <p className="font-semibold text-lg text-red-800 dark:text-red-300">{error}</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700">
                        <table className="w-full">
                            <thead>
                                <tr className="bgn  text-white">
                                    <th className="py-4 px-5 text-left text-sm font-semibold">#</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold">Level Name</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold">SAO</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold">SGO</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold">INCENTIVE</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold">BONUS</th>
                                    <th className="py-4 px-5 text-left text-sm font-semibold">TOTAL INCOME</th>
                                    {/* <th className="py-4 px-5 text-left text-sm font-semibold">Edit</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 ? (
                                    [...data]
                                        .sort((a, b) => a.sao - b.sao)
                                        .map((item, index) => (
                                            <tr
                                                key={index}
                                                className={`border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-slate-100"} `}
                                            >
                                                <td className="py-3 px-5 font-medium">{index + 1}</td>
                                                <td className="py-3 px-5 font-bold text-gray-900 dark:text-white">{item.level_name}</td>
                                                <td className="py-3 px-5">{item.sao}</td>
                                                <td className="py-3 px-5">{item.sgo}</td>
                                                <td className="py-3 px-5">
                                                    ₹ {Number(item.bonus_income).toLocaleString("en-IN")}
                                                </td>
                                                <td className="py-3 px-5">
                                                    ₹ {Number(item.performance_income).toLocaleString("en-IN")}
                                                </td>

                                                <td className="py-3 px-5">
                                                    ₹ {(Number(item.performance_income) + Number(item.bonus_income)).toLocaleString("en-IN")}
                                                </td>

                                                {/* <td className="py-3 px-5">
                                                    <Link href={`./update/${item._id}`}>
                                                        <span className="bgw text-xs font-semibold px-3 py-1 rounded-full textn">
                                                            Edit
                                                        </span>
                                                    </Link>
                                                </td> */}
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center py-12 text-gray-500 font-medium">
                                            No data found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}