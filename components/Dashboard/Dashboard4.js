"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
    Wallet,
    Star,
    TrendingUp,
    Circle,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard4() {
    const { data: session } = useSession();
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
            if (!session?.user?.email) return;
            try {
                const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
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
    }, [session?.user?.email]);

    useEffect(() => {
        if (saosp > 0 && sgosp > 0) {
            const matchedUnits = Math.min(saosp, sgosp);
            const commission = matchedUnits * 10;
            setTotalCommission(commission);
        }
    }, [saosp, sgosp]);
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
        const income = parseFloat(totalGrowth) + parseFloat(totalPerformance) + parseFloat(totalCommission);
        setTotalIncome(income);
    }, [totalGrowth, totalPerformance, totalCommission]);




    if (loading) return <SkeletonLoader />;
    if (error) return <p className="text-red-500 text-center font-semibold">{error}</p>;

    return (
        <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Current Week & RSP */}
                <DashboardGroup title="Weekly SP">
                    <DashboardCard
                        title="Current Weak SAO SP"
                        value={rspData?.teamweeksaosp || 0}
                        icon={<Star className="text-purple-500" />}
                    />
                    <DashboardCard
                        title="Current Weak SGO SP"
                        value={rspData?.teamweeksgosp || 0}
                        icon={<Star className="text-purple-500" />}
                    />
                    <DashboardCard
                        title="Current Self RSP"
                        value={rspData.selfRSPWeek}
                        icon={<TrendingUp className="text-purple-500" />}
                    />
                    <DashboardCard
                        title="Current Team RSP"
                        value={rspData.teamRSPWeek}
                        icon={<TrendingUp className="text-purple-500" />}
                    />
                </DashboardGroup>

                {/* Total RSP & Income */}
                <DashboardGroup title="Overall Stats">
                    <DashboardCard
                        title="Total Self RSP"
                        value={rspData.selfRSPAll}
                        icon={<Star className="text-purple-500" />}
                    />
                    <DashboardCard
                        title="Total Team RSP"
                        value={rspData.teamRSPAll}
                        icon={<Star className="text-purple-500" />}
                    />
                    <div className="p-5 rounded bgg textn space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Wallet className="text-green-500" />
                            </div>
                            <p className="font-bold text-lg">Income Overview</p>
                        </div>
                        <p>Sales Commission: <span className="font-semibold textb">{totalCommission}</span></p>
                        <p>Sales Growth: <span className="font-semibold textb">{totalGrowth}</span></p>
                        <p>Sales Performance: <span className="font-semibold textb">{totalPerformance}</span></p>
                        <div className="pt-2 border-t border-gray-300 dark:border-gray-600">
                            <p className="font-bold">Total Income: <span className="text-blue-600 dark:text-blue-400">{totalIncome}</span></p>
                        </div>
                    </div>
                </DashboardGroup>

                {/* Bonanza and Conditional Rendering */}
                {userdata !== "2" && (
                    <DashboardGroup title="Bonanza">
                        <DashboardCard
                            title="Bonanza SAO"
                            value={bonanza?.sao}
                            icon={<Circle className="text-green-500" />}
                        />
                        <DashboardCard
                            title="Bonanza SGO"
                            value={bonanza?.sgo}
                            icon={<Circle className="text-green-500" />}
                        />
                        <Link href="./bonanza" className="text-center p-3 rounded bgg textn font-semibold hover:opacity-90 transition-opacity">
                            View Details
                        </Link>
                    </DashboardGroup>
                )}
            </div>
        </div>
    );
}

function DashboardGroup({ title, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5 border-b-2 border-gray-200 dark:border-gray-600 pb-3">
                {title}
            </h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function DashboardCard({ title, value, icon }) {
    return (
        <div className="p-4 rounded flex items-center gap-4 bgg dark:bg-gray-700">
            <div className="p-3 bg-white dark:bg-gray-600 rounded-full shadow-md">
                {icon}
            </div>
            <div>
                <p className="text-gray-600 dark:text-gray-300 font-semibold">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
        </div>
    );
}

function SkeletonLoader() {
    return (
        <div className="p-4 md:p-6 bgg dark:bg-gray-900">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 space-y-5">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/2 animate-pulse"></div>
                        <div className="space-y-4">
                            {[...Array(2)].map((_, j) => (
                                <div key={j} className="flex items-center gap-5 p-4 rounded bg-gray-100 dark:bg-gray-700">
                                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4 animate-pulse"></div>
                                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-md w-1/2 animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
