"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trophy, ArrowUpRight, FileText } from "lucide-react";

export default function Dashboard3({dscode}) {
    const [data, setData] = useState("");
    const [level, setLevel] = useState([]);
    const [nextLevelTarget, setNextLevelTarget] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!dscode) return;
            try {
                const response = await axios.get(`/api/user/finduserbyid/${dscode}`);
                setData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setError("Failed to load data.");
                setLoading(false);
            }
        };
        fetchUserData();
    }, [dscode]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/level/fetch/level");
                const levelsData = response.data.data || [];
                setLevel(levelsData);

                // Find the user's current level object
                const currentLevel = levelsData.find(lvl => lvl.level_name === data?.level);

                if (currentLevel) {
                    // Convert sao values to numbers for comparison
                    const sortedLevels = levelsData
                        .map(lvl => ({ ...lvl, sao: Number(lvl.sao) })) // Ensure sao is numeric
                        .sort((a, b) => a.sao - b.sao); // Sort by sao value

                    // Find the next level with a higher sao
                    const nextLevel = sortedLevels.find(lvl => lvl.sao > currentLevel.sao);

                    if (nextLevel) {
                        const userSaosp = Number(data?.saosp) || 1; // Default to 1 to avoid division by zero
                        const nextSao = nextLevel.sao;

                        // Calculate ratio
                        const divisor = gcd(nextSao, userSaosp); // Get greatest common divisor
                        const ratio = `${nextSao / divisor}:${userSaosp / divisor}`;

                        setNextLevelTarget(ratio);
                    } else {
                        setNextLevelTarget("MAX");
                    }
                } else {
                    setNextLevelTarget("N/A");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [data?.level]);


    if (loading) return <SkeletonLoader />;
    if (error) return <p className="text-red-500 text-center font-semibold">{error}</p>;

    return (
        <div className="space-y-3">
          {/* Item 1 */}
          <div className="relative p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700">
                <Trophy className="text-purple-500 w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-white font-medium">Trip Commission</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">0.00</p>
              </div>
            </div>
          </div>
      
          {/* Item 2 */}
          <div className="relative p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700">
                <ArrowUpRight className="text-red-500 w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-white font-medium">Current Level</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-300">{data?.level ?? "N/A"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Level Next Target: {nextLevelTarget}</p>
              </div>
            </div>
          </div>
      
          {/* Item 3 */}
          <div className="relative p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-700">
                <FileText className="text-gray-500 w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-white font-medium">Bonanza Status</p>
                <p className="text-sm font-semibold text-red-500 dark:text-gray-300">pending</p>
              </div>
            </div>
          </div>
        </div>
      );
      
}


function SkeletonLoader() {
    return (
      <div className="space-y-3 p-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-3 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md h-20"></div>
        ))}
      </div>
    );
  }
  
export function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}
