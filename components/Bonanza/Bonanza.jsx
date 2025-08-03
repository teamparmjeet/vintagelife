'use client';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function Bonanza() {
    const [data, setData] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [userdata, setUserdata] = useState(null);
    const [userds, setUserds] = useState("");
    const { data: session } = useSession();

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return "Invalid date";
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }

    useEffect(() => {
        if (!session?.user?.email) return;
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
                setUserdata(res.data);
                setUserds(res.data.dscode);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUserData();
    }, [session?.user?.email]);

    useEffect(() => {
        if (!userds) return;
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/3months/findds/${userds}`);
                const json = await res.json();
                if (json.success) {
                    setData(json.data[0] || null);
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchData();
    }, [userds]);

    if (initialLoading) {
        return (
            <div className="text-2xl text-[#8B5E3C] font-serif animate-pulse text-center mt-10">
                Loading your vintage Bonanza...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 text-lg sm:text-xl text-gray-500 font-serif">
                No Bonanza data found.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-8 mt-8 px-4">
            {/* Bonanza Title Card */}
            <div className="relative w-full  bg-gradient-to-r from-[#FEECE2] to-[#F7DED0] rounded-xl shadow p-6 text-center">
                <Link href="./bonanza">
                    <h1 className="text-3xl font-bold font-serif text-[#5A3E36] underline decoration-[#E2BFB3] underline-offset-4">
                        Bonanza: {data.title}
                    </h1>
                    <p className="text-sm sm:text-base mt-3 text-[#6B4C3B]">
                        {formatDate(data.datefrom)} &mdash; {formatDate(data.dateto)}
                    </p>
                    <span className="absolute top-3 right-3 bg-[#E2BFB3] text-white text-xs px-3 py-1 rounded-full shadow-md">
                        Click here
                    </span>
                </Link>
            </div>

            {/* Progress Cards */}
            <div className="flex flex-wrap justify-center gap-8 ">
                {['SAO', 'SGO'].map(type => {
                    if (!data?.UserDetails?.[0]?.userlevel) {
                        return null; // skip rendering this card if userlevel is missing
                    }
                    const userSP = parseInt(userdata?.[`${type.toLowerCase()}sp`] || "0");
                    const baseSP = parseInt(data?.UserDetails?.[0]?.[`${type.toLowerCase()}sp`] || "0");
                    const current = userSP - baseSP;

                    const userLevel = data.UserDetails[0].userlevel;
                    const levelTarget = data.levels?.find(lvl => lvl.level === userLevel);
                    const target = levelTarget ? parseInt(levelTarget[type.toLowerCase()] || "0") : 0;

                    const isAchieved = current >= target;

                    return (
                        <div
                            key={type}
                            className="bg-white border border-[#E5D4C1] rounded-2xl shadow-lg w-full max-w-sm p-5 "
                        >
                            {isAchieved && (
                                <div className="text-center bg-green-50 border border-green-200 text-green-700 py-2 px-3 rounded-lg shadow-sm mb-4 ">
                                    🎉 Great job! You have achieved your target!
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-4 border-b pb-2 border-[#CBBCAF]">
                                <h2 className="text-xl font-semibold text-[#5A3E36]">{type} SP</h2>
                                <span className="text-sm text-[#9C7B6A] italic">Progress Overview</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between bg-[#FFF8F0] rounded-lg px-4 py-3 border border-[#E5D4C1]">
                                    <span className="text-[#6B4C3B] font-medium">Current Achieve</span>
                                    <span className="text-[#3E7C59] font-semibold">{current} SP</span>
                                </div>

                                <div className="flex justify-between bg-[#FFF8F0] rounded-lg px-4 py-3 border border-[#E5D4C1]">
                                    <span className="text-[#6B4C3B] font-medium">Target</span>
                                    <span className="text-[#335C81] font-semibold">{target} SP</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
