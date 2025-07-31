"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import {
  Users,
  Target,
  UserCheck,
  Calendar,
  Layers,
  UserPlus,
  Wallet,
  Award,
} from "lucide-react";

// Format numbers or currency
const formatCount = (value, type = "number") => {
  if (type === "currency") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat("en-IN").format(value);
};

// Skeleton loader card
const SkeletonCard = () => (
  <div className="bg-white shadow-md rounded-md p-6 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="w-2/3 h-6 bg-gray-200 rounded"></div>
      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
    </div>
    <div className="mt-4 w-1/2 h-8 bg-gray-200 rounded"></div>
  </div>
);

// Card component
const Card = ({ title, count, color, Icon, type = "number" }) => (
  <div
    className="relative bg-white shadow-lg border-6 rounded-lg border-gray-200 overflow-hidden"
    style={{ borderLeftColor: color }}
  >
    <div className="p-5 flex justify-between items-center">
      <div>
        <p className="text-gray-500 font-semibold text-sm uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold" style={{ color: color }}>
          {type === "text" ? count : formatCount(count, type)}
        </p>
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-7 h-7" style={{ color: color }} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const params = useParams(); // dynamic route param (dscode)
  const searchParams = useSearchParams(); // query param (email)

  const dscode = params?.dscode;
  const email = searchParams.get("email");

  const [panelData, setPanelData] = useState(null);
  const [totalPerformance, setTotalPerformance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dscode || !email) return;

    const fetchPanelData = async () => {
      try {
        const [panelResponse, userResponse] = await Promise.all([
          axios.get(`/api/userpanel/${dscode}`),
          axios.get(`/api/user/find-admin-byemail/${email}`),
        ]);
        setPanelData(panelResponse.data);
        setTotalPerformance(
          userResponse.data.totalPerformanceIncome + userResponse.data.totalBonusIncome
        );
      } catch (error) {
        console.error("Error fetching panel data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPanelData();
  }, [dscode, email]);

  const labelMap = panelData
    ? [
      {
        title: "SAO RP",
        count: panelData.mainUser?.saosp || 0,
        color: "#3293ba",
        Icon: Target,
      },
      {
        title: "SGO SP",
        count: panelData.mainUser?.sgosp || 0,
        color: "#f28430",
        Icon: Target,
      },
      {
        title: "Total SAO",
        count: panelData.totalSAO || 0,
        color: "#5cba47",
        Icon: Users,
      },
      {
        title: "Total SGO",
        count: panelData.totalSGO || 0,
        color: "#a94dd6",
        Icon: Users,
      },
      {
        title: "Active SAO",
        count: panelData.totalActiveSAO || 0,
        color: "#ff7b7b",
        Icon: UserCheck,
      },
      {
        title: "Active SGO",
        count: panelData.totalActiveSGO || 0,
        color: "#2eb872",
        Icon: UserCheck,
      },
      {
        title: "This Week SAO SP",
        count: panelData.currentWeekSaoSP || 0,
        color: "#ffb347",
        Icon: Calendar,
      },
      {
        title: "This Week SGO SP",
        count: panelData.currentWeekSgoSP || 0,
        color: "#7f55a3",
        Icon: Calendar,
      },
      {
        title: "Current Level",
        count: panelData.mainUser?.level || 0,
        color: "#4a4a4a",
        Icon: Layers,
        type: "text",
      },
      {
        title: "Direct SAO",
        count: panelData.directSao || 0,
        color: "#3b82f6",
        Icon: UserPlus,
      },
      {
        title: "Direct SGO",
        count: panelData.directSgo || 0,
        color: "#8b5cf6",
        Icon: UserPlus,
      },

      {
        title: "Current Weak Sao Rp",
        count: panelData.currentWeekSaoSP || 0,
        color: "#8b5cf6",
        Icon: Target,
      },
      {
        title: "Current Weak Sgo Rp",
        count: panelData.currentWeekSgoSP || 0,
        color: "#8b5cf6",
        Icon: Target,
      },
      {
        title: "Pair Matching Income",
        count:
          Math.min(
            panelData.mainUser?.saosp ?? 0,
            panelData.mainUser?.sgosp ?? 0
          ) * 10,
        color: "#d64d9b",
        Icon: Wallet,
        type: "currency",
      },
      {
        title: "Royalty Income",
        count: totalPerformance || 0,
        color: "#eab308",
        Icon: Award,
        type: "currency",
      },
      {
        title: "Total Income",
        count:
          (Math.min(panelData.mainUser?.saosp ?? 0, panelData.mainUser?.sgosp ?? 0) * 10) +
          (totalPerformance || 0),
        color: "green",
        Icon: Award,
        type: "currency",
      }


    ]
    : [];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Render 8 skeleton cards while loading */}
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {labelMap.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              count={item.count}
              color={item.color}
              Icon={item.Icon}
              type={item.type}
            />
          ))}



        </div>
      )}
    </div>
  );
}