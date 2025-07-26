"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Wallet,
    Star,
    TrendingUp,
    Circle,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard4({ dscode, fromDate, toDate }) {
    const [dsid, setDsid] = useState("");
    const [wallet, setWallet] = useState("");
    const [userdata, setUserdata] = useState("");
    const [saosp, setSaosp] = useState(0);
    const [sgosp, setSgosp] = useState(0);
    const [data, setData] = useState(null);
    const [rspData, setRspData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [bonanza, setBonanza] = useState("");
    const [totalGrowth, setTotalGrowth] = useState(0);
    const [totalCommission, setTotalCommission] = useState(0);

    const [totalPerformance, setTotalPerformance] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/3months/fetch/all');
                const json = await res.json();
                if (json.success) {
                    setBonanza(json.data[0] || null);
                    console.log(json.data[0])
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchUserData = async () => {
            if (!dscode) return;
            try {
                const response = await axios.get(`/api/user/finduserbyid/${dscode}`);
                setDsid(response.data.dscode);
                setWallet(response.data.WalletDetails);
                setUserdata(response.data.usertype);

                setTotalGrowth(response.data.totalBonusIncome);
                setTotalPerformance(response.data.totalPerformanceIncome);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUserData();
    }, [dscode]);


    useEffect(() => {
        if (!dsid) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch both APIs simultaneously
                const [teamResponse, rspResponse] = await Promise.all([
                    axios.get(`/api/dashboard/teamsp/${dsid}`),
                    axios.get(`/api/dashboard/rsp/${dsid}`)
                ]);

                setData(teamResponse.data);
                setRspData(rspResponse.data);
                setSaosp(parseFloat(teamResponse.data.totalSaoSP || 0));
                setSgosp(parseFloat(teamResponse.data.totalSgoSP || 0));
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dsid]);
    useEffect(() => {
        if (saosp > 0 && sgosp > 0) {
            const matchedUnits = Math.min(saosp, sgosp);
            const commission = matchedUnits * 10;
            setTotalCommission(commission);
        }
    }, [saosp, sgosp]);
    useEffect(() => {
        const income = parseFloat(totalGrowth) + parseFloat(totalPerformance) + parseFloat(totalCommission);
        setTotalIncome(income);
    }, [totalGrowth, totalPerformance, totalCommission]);



    if (loading) return <SkeletonLoader />;
    if (error) return <p className="text-red-500 text-center font-semibold">{error}</p>;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">


                <div className="relative p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border overflow-hidden">
                    <div className={`absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] from-purple-500`}></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"><Star className="text-purple-500" /></div>
                        <p className="text-gray-700 dark:text-white font-semibold">Current Weak</p>
                    </div>
                    <p className="text-gray-700 dark:text-white font-semibold">SAO SP: <span className="text-blue-800 ms-4">{rspData?.teamweeksaosp || 0}</span></p>
                    <p className="text-gray-700 dark:text-white font-semibold">SGO SP: <span className="text-blue-800 ms-4">{rspData?.teamweeksgosp || 0}</span></p>
                </div>


                <div className="relative p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border overflow-hidden">
                    <div className={`absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] from-purple-500`}></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"><TrendingUp className="text-purple-500" /></div>
                        <p className="text-gray-700 dark:text-white font-semibold">Current RSP</p>
                    </div>
                    <p className="text-gray-700 dark:text-white font-semibold">Self RSP:{rspData.selfRSPWeek}</p>
                    <p className="text-gray-700 dark:text-white font-semibold">Team RSP:{rspData.teamRSPWeek}</p>
                </div>

                <div className="relative p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border overflow-hidden">
                    <div className={`absolute top-0 right-0 w-0 h-0 border-l-[40px] border-l-transparent border-t-[40px] from-purple-500`}></div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"><Star className="text-purple-500" /></div>
                        <p className="text-gray-700 dark:text-white font-semibold">Total RSP</p>
                    </div>
                    <p className="text-gray-700 dark:text-white font-semibold">Self RSP: {rspData.selfRSPAll}</p>
                    <p className="text-gray-700 dark:text-white font-semibold">Team RSP: {rspData.teamRSPAll}</p>
                </div>


                <div className="relative p-6 w-full  bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden ">

                    {/* Decorative Ribbon */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-purple-500"></div>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 shadow">
                            <Wallet className="text-green-500 w-6 h-6" />
                        </div>
                        <p className="text-lg font-bold text-gray-800 dark:text-white">Income Overview</p>
                    </div>

                    {/* Info Rows */}
                    <div className="space-y-2 text-sm">
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Sales Commission:</span>
                            <span className="ml-2 text-gray-800 dark:text-white">{totalCommission}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Sales Growth:</span>
                            <span className="ml-2 text-gray-800 dark:text-white">{totalGrowth}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Sales Performance:</span>
                            <span className="ml-2 text-gray-800 dark:text-white">{totalPerformance}</span>
                        </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-md">
                        <p className="text-gray-700 dark:text-white font-semibold">
                            Total Income:
                            <span className="text-blue-700 dark:text-blue-400 ms-2">{totalIncome}</span>
                        </p>
                    </div>



                </div>

                {userdata !== "2" && (
                    <div className="relative p-6 w-full  bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden ">

                        {/* Decorative Ribbon */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-purple-500"></div>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 shadow">
                                <Circle className="text-green-500 w-6 h-6" />
                            </div>
                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                                Bonanza</p>
                        </div>

                        {/* Info Rows */}
                        <div className="space-y-2 text-sm">
                            <p className="text-gray-600 dark:text-gray-300 flex flex-col">
                                <span className="font-semibold">Bonanza SAO</span>
                                <span className="ml-2 text-gray-800 dark:text-white">{bonanza?.sao}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 flex flex-col">
                                <span className="font-semibold">Bonanza SGO</span>
                                <span className="ml-2 text-gray-800 dark:text-white">{bonanza?.sgo}</span>
                            </p>

                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-md">
                            <Link href={`./bonanza/${dscode}`}>
                                <p className="text-gray-700 dark:text-white font-semibold">
                                    View
                                </p>
                            </Link>
                        </div>
                    </div>
                )}








            </div>
        </div>
    )
}

function SkeletonLoader() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="p-5 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl h-40"></div>
            ))}
        </div>
    );
}