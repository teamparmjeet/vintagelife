"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Users, Target, UserCheck, UserX, TrendingUp } from "lucide-react";

// Main Dashboard Component
export default function Dashboard1() {
  const { data: session } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false); // 👈 Add this ref

  useEffect(() => {
    if (hasFetched.current) return; // 👈 Prevent refetching
    if (session === undefined) return;

    if (!session?.user?.email) {
      setError("You must be logged in to view this data.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const userResponse = await axios.get(
          `/api/user/find-admin-byemail/${session.user.email}`
        );
        const dsid = userResponse.data.dscode;

        if (!dsid) {
          setError("Could not find required user permissions (DSID).");
          setLoading(false);
          return;
        }

        const dashboardResponse = await axios.get(`/api/dashboard/teamsp/${dsid}`);
        if (dashboardResponse.data) {
          setData(dashboardResponse.data);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "An unexpected error occurred.";
        setError(`Failed to load dashboard data: ${errorMessage}`);
      } finally {
        setLoading(false);
        hasFetched.current = true; // 👈 Mark as fetched
      }
    };

    fetchData();
  }, [session]); // The effect now only depends on the session object

  // Conditional Rendering Logic
  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <p className="text-red-500 text-center font-semibold text-lg p-8">{error}</p>;
  }

  if (!data) {
    return <p className="textn text-center font-semibold text-lg p-8">No data available.</p>;
  }

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardGroup title="Team SP">
          <DashboardCard
            title="SAO Team SP"
            value={data?.totalSaoSP || 0}
            icon={<TrendingUp />}
          />
          <DashboardCard
            title="SGO Team SP"
            value={data?.totalSgoSP || 0}
            icon={<TrendingUp />}
          />
        </DashboardGroup>

        <DashboardGroup title="Team ID">
          <DashboardCard
            title="SAO Team ID"
            value={data?.totalSAO || 0}
            icon={<Target />}
          />
          <DashboardCard
            title="SGO Team ID"
            value={data?.totalSGO || 0}
            icon={<Target />}
          />
        </DashboardGroup>

        <DashboardGroup title="Total Team">
          <DashboardProgressCard
            title="SAO Total Team"
            total={data?.totalSAO || 0}
            active={data?.totalActiveSAO || 0}
          />
          <DashboardProgressCard
            title="SGO Total Team"
            total={data?.totalSGO || 0}
            active={data?.totalActiveSGO || 0}
          />
        </DashboardGroup>
      </div>
    </div>
  );
}

// Helper Components (Unchanged)

function DashboardGroup({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 ">
      <h2 className="text-xl font-bold textn mb-5 border-b-4 pb-3">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className={`p-5 rounded flex items-center gap-5 bgg`}>
      <div className="p-3 bg-white rounded-full shadow-sm textn">
        {icon}
      </div>
      <div>
        <p className="textn font-semibold">{title}</p>
        <p className={`text-3xl font-bold textb`}>{value}</p>
      </div>
    </div>
  );
}

function DashboardProgressCard({ title, total, active }) {
  const inactive = Math.max(0, total - active);
  const activePercentage = total > 0 ? (active / total) * 100 : 0;

  return (
    <div className="p-5 rounded bgw border-2 space-y-3">
      <p className="font-bold textn">{title}</p>

      <div className="w-full bg-white rounded-full h-2.5 border ">
        <div
          className="bgn h-full rounded-full"
          style={{ width: `${activePercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between items-center text-sm font-semibold">
        <div className="flex items-center gap-2 textn">
          <UserCheck size={16} />
          <span>Active: {active}</span>
        </div>
        <div className="flex items-center gap-2 text-[#b96464]">
          <UserX size={16} />
          <span>Inactive: {inactive}</span>
        </div>
        <div className="flex items-center gap-2 textb">
          <Users size={16} />
          <span>Total: {total}</span>
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="p-4 md:p-6 bgw ">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border-2 space-y-5">
            <div className="h-8 bgg rounded-md w-1/2 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, j) => (
                <div key={j} className="flex items-center gap-5 p-4 rounded bgg">
                  <div className="h-12 w-12 bg-white rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white rounded-md w-3/4 animate-pulse"></div>
                    <div className="h-8 bg-white rounded-md w-1/2 animate-pulse"></div>
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