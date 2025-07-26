"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Trophy, ArrowUpRight, FileText, Users, UserCheck, UserX } from "lucide-react";

// Helper function to find the greatest common divisor (for ratio calculation)
export function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// Main Dashboard Component - Redesigned
export default function Dashboard3() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [nextLevelTarget, setNextLevelTarget] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  // Effect to fetch all necessary data
  useEffect(() => {
    // Prevent refetching on re-renders
    if (hasFetched.current) return;
    if (session === undefined) return; // Wait until session is loaded

    if (!session?.user?.email) {
      setError("You must be logged in to view this data.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Fetch user data to get their current level and SP
        const userResponse = await axios.get(
          `/api/user/find-admin-byemail/${session.user.email}`
        );
        const currentUser = userResponse.data;

        // More robust check to prevent errors and provide better feedback
        if (!currentUser || typeof currentUser !== 'object' || Object.keys(currentUser).length === 0) {
            setError("Could not retrieve valid user data. The user may not exist or the API response was empty.");
            setLoading(false);
            return;
        }

        // Set user data only after initial validation
        setUserData(currentUser);

        // 2. Fetch all available levels to find the next one
        const levelsResponse = await axios.get("/api/level/fetch/level");
        const allLevels = levelsResponse.data.data || [];

        // 3. Calculate the next level target, gracefully handling if 'level' is missing
        if (currentUser.level) {
            const currentLevel = allLevels.find(lvl => lvl.level_name === currentUser.level);

            if (currentLevel) {
              // Ensure 'sao' is numeric and sort levels by it
              const sortedLevels = allLevels
                .map(lvl => ({ ...lvl, sao: Number(lvl.sao) }))
                .sort((a, b) => a.sao - b.sao);

              // Find the next level with a higher 'sao' value
              const nextLevel = sortedLevels.find(lvl => lvl.sao > Number(currentLevel.sao));

              if (nextLevel) {
                // Display the required SP for the next level
                setNextLevelTarget(`${nextLevel.sao} SP`);
              } else {
                // User is at the highest level
                setNextLevelTarget("Max Level Reached");
              }
            } else {
                // The user's level is present but not found in the levels list
                setNextLevelTarget("Unknown Level");
            }
        } else {
            // If currentUser.level is missing, set target to "N/A" instead of throwing an error
            setNextLevelTarget("N/A");
        }

      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "An unexpected error occurred.";
        setError(`Failed to load dashboard data: ${errorMessage}`);
      } finally {
        setLoading(false);
        hasFetched.current = true; // Mark as fetched
      }
    };

    fetchData();
  }, [session]); // Dependency on session object

  // Conditional Rendering Logic
  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return <p className="text-red-500 text-center font-semibold text-lg p-8">{error}</p>;
  }

  if (!userData) {
    return <p className="text-gray-500 text-center font-semibold text-lg p-8">No data available.</p>;
  }

  return (
    <>
      

      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Group 1: Trip Commission */}
          <DashboardGroup title="Trip Commission">
            <DashboardCard
              title="Total Commission"
              value={"₹0.00"}
              icon={<Trophy className="text-purple-600" />}
            />
          </DashboardGroup>

          {/* Card Group 2: Level Status */}
          <DashboardGroup title="Level Status">
            {/* Custom card structure to fit the design */}
            <div className="p-5 rounded bgg">
              <div className="flex items-center gap-5">
                 <div className="p-3 bg-white rounded-full shadow-sm">
                   <ArrowUpRight className="text-green-600" />
                 </div>
                 <div>
                   <p className="textn font-semibold">Current Level</p>
                   <p className="text-3xl font-bold textb">{userData?.level ?? "N/A"}</p>
                 </div>
              </div>
              <div className="mt-4 text-center bg-white p-2 rounded-lg border">
                 <p className="text-sm font-semibold textn">
                   Next Level Target: <span className="font-bold textb">{nextLevelTarget}</span>
                 </p>
              </div>
            </div>
          </DashboardGroup>

          {/* Card Group 3: Bonanza Status */}
          <DashboardGroup title="Bonanza Status">
            <DashboardCard
              title="Current Status"
              value={"Pending"}
              icon={<FileText className="text-orange-600" />}
            />
          </DashboardGroup>
        </div>
      </div>
    </>
  );
}

// --- Helper Components (from Dashboard1 design) ---

function DashboardGroup({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-xl font-bold text-gray-800 mb-5 border-b-2 border-gray-100 pb-3">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="p-5 rounded flex items-center gap-5 bgg">
      <div className="p-3 bg-white rounded-full shadow-sm">
        {icon}
      </div>
      <div>
        <p className="textn font-semibold">{title}</p>
        <p className="text-3xl font-bold textb">{value}</p>
      </div>
    </div>
  );
}

// Note: This component is included for completeness but not used in this specific redesign.
function DashboardProgressCard({ title, total, active }) {
  const inactive = Math.max(0, total - active);
  const activePercentage = total > 0 ? (active / total) * 100 : 0;

  return (
    <div className="p-5 rounded bgw border space-y-3">
      <p className="font-bold textn">{title}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
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
        <div className="flex items-center gap-2 text-red-600">
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
    <div className="p-4 md:p-6 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border space-y-5">
            {/* Skeleton for the group title */}
            <div className="h-8 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
            <div className="space-y-4">
              {/* Skeleton for a card */}
              <div className="flex items-center gap-5 p-4 rounded bg-gray-100">
                <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded-md w-1/2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
