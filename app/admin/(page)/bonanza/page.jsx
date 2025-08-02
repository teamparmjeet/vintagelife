'use client';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Page() {
  const [data, setData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userdata, setUserdata] = useState(null);
  const [userds, setUserds] = useState("");
  const { data: session } = useSession();

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

  const formatDateRange = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const options = { day: '2-digit', month: 'short' };
    const fromStr = fromDate.toLocaleDateString('en-GB', options);
    const toStr = toDate.toLocaleDateString('en-GB', options);

    return fromDate.getMonth() === toDate.getMonth() && fromDate.getFullYear() === toDate.getFullYear()
      ? `${fromDate.getDate()} to ${toStr} ${toDate.getFullYear()}`
      : `${fromStr} to ${toStr} ${toDate.getFullYear()}`;
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FEECE2] to-[#F7DED0] flex items-center justify-center p-4">
        <div className="text-xl sm:text-2xl text-[#FFBE98] font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-lg sm:text-xl text-gray-500">
        No Bonanza data found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#F7DED0] p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#5A3E36]">Bonanza Pendency</h1>
          <p className="text-gray-700 mt-2">{formatDateRange(data.datefrom, data.dateto)}</p>
          <div className="mt-2 inline-block bg-white px-4 py-2 rounded-lg shadow text-lg font-semibold text-blue-800">
            {data.title}
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {['SAO', 'SGO'].map(type => {
            const userSP = parseInt(userdata?.[`${type.toLowerCase()}sp`] || "0");
            const baseSP = parseInt(data?.UserDetails?.[0]?.[`${type.toLowerCase()}sp`] || "0");
            const current = userSP - baseSP;

            const userLevel = data.UserDetails[0].userlevel;
            const levelTarget = data.levels?.find(lvl => lvl.level === userLevel);
            const target = levelTarget ? parseInt(levelTarget[type.toLowerCase()] || "0") : 0;

            const remain = Math.max(0, target - current);
            const isAchieved = current >= target;

            const progressPercent = target > 0 ? Math.min(100, (current / target) * 100) : 0;

            return (
              <div key={type} className="bg-white rounded-xl shadow-lg p-6 border border-[#E5D4C1] hover:shadow-xl transition">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[#5A3E36]">{type} RP</h2>
                  {isAchieved && (
                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">Great Job 🎉</span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-500 ${isAchieved ? "bg-green-500" : "bg-[#FFBE98]"
                      }`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>Current: <b>{current} RP</b></span>
                  <span>Target: <b>{target} RP</b></span>
                </div>
                <div className={`text-sm font-semibold ${remain > 0 ? "text-rose-500" : "text-green-600"}`}>
                  {remain > 0 ? `${remain} RP Remaining` : "Target Achieved ✅"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
