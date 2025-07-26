"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard1({ dscode, fromDate, toDate }) {
    const [dsid, setDsid] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fromfromDate = fromDate?.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    const fromtoDate = toDate?.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    useEffect(() => {
        if (!dscode) return;
    
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (fromDate) params.append("from", fromDate.toISOString());
                if (toDate) params.append("to", toDate.toISOString());
    
                const url = `/api/dashboard/teamsp/${dscode}?${params.toString()}`;
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [dscode, fromDate, toDate]);
    
    

    if (loading) return <SkeletonLoader />;
    if (error) return <p className="text-red-500 text-center font-semibold">{error}</p>;

    return (
        <div className="space-y-6 bg-gray-50 dark:bg-gray-900 p-4">
          <DashboardGroup title="Team SP">
            <DashboardCard title="SAO Team SP" value={data?.totalSaoSP || 0} />
            <DashboardCard title="SGO Team SP" value={data?.totalSgoSP || 0} />
          </DashboardGroup>
      
          <DashboardGroup title="Team ID">
            <DashboardCard title="SAO Team ID" value={data?.totalSAO || 0} />
            <DashboardCard title="SGO Team ID" value={data?.totalSGO || 0} />
          </DashboardGroup>
      
          <DashboardGroup title="Total Team">
            <DashboardCard2 title="SAO Total Team" value={data?.totalActiveSAO || 0} value1={data?.totalSAO || 0} />
            <DashboardCard2 title="SGO Total Team" value={data?.totalActiveSGO || 0} value1={data?.totalSGO || 0} />
          </DashboardGroup>
        </div>
      );
      
}

function DashboardGroup({ title, children }) {
    return (
      <div className="space-y-2">
        <h2 className="text-md font-semibold text-gray-700 dark:text-gray-200 border-b pb-1">{title}</h2>
        <div className="space-y-2">{children}</div>
      </div>
    );
  }
  

  function DashboardCard({ title, value }) {
    return (
      <div className="relative p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border text-sm">
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[25px] border-l-transparent border-t-[25px] border-t-sky-500"></div>
        <p className="text-gray-600 dark:text-gray-300">{title}</p>
        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{value}</p>
      </div>
    );
  }
  

  function DashboardCard2({ title, value, value1 }) {
    return (
      <div className="relative p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border text-sm">
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[25px] border-l-transparent border-t-[25px] border-t-sky-500"></div>
        <p className="text-gray-600 dark:text-gray-300">{title}</p>
        <div className="flex items-center gap-1 mt-1">
          <p className="text-lg font-semibold text-green-600 dark:text-green-400">{value}</p>
          <span className="text-sm text-gray-500 dark:text-gray-400">/</span>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">{Math.max(0, value1 - value)}</p>
        </div>
      </div>
    );
  }
  

  function SkeletonLoader() {
    return (
      <div className="space-y-3 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }
  