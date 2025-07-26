"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const thdata = [
  "Step",
  "Level",
  "Total SAOSP",
  "Total SGOSP",
  "SAOSP",
  "SGOSP",
  "Remain SAOSP",
  "Remain SGOSP",
  "Status",
];

export default function Page() {
  const [stepPendingData, setStepPendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [userdata, setUserdata] = useState([]);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        setUserdata(response.data.LevelDetails);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [session?.user?.email]); // ✅ Dependency is correct


  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch("/api/level/fetch/level");
        const result = await response.json();
        if (result.success) {
          setStepPendingData(result.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  return (
    <div className="lg:p-6  mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-700 dark:text-white mb-6">
        Step Pending
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <div className="overflow-x-auto lg:p-4 bg-gray-100 rounded-xl shadow-md">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <thead className="bg-blue-600 text-white text-sm uppercase sticky top-0">
                <tr>
                  {thdata.map((header, index) => (
                    <th key={index} className="lg:p-4 p-2 border-b border-gray-300 text-center text-sm font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stepPendingData.length > 0 ? (
                  stepPendingData.map((item, index) => {
                    const userLevelData = Array.isArray(userdata)
                      ? userdata.find((u) => u.levelName === item.level_name)
                      : undefined;

                    const sao = userLevelData ? parseFloat(userLevelData.sao) : 0;
                    const sgo = userLevelData ? parseFloat(userLevelData.sgo) : 0;

                    const remainSAOSP = Math.max(0, parseFloat(item.sao) - sao);
                    const remainSGOSP = Math.max(0, parseFloat(item.sgo) - sgo);

                    const status = remainSAOSP === 0 && remainSGOSP === 0 ? "Complete" : "Pending";

                    return (
                      <tr
                        key={index}
                        className={`border-b text-gray-700 dark:bg-gray-800 dark:text-white transition-all ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-100`}
                      >
                        <td className="p-3 border text-center font-medium">{index + 1}</td>
                        <td className="p-3 border text-center font-medium">{item.level_name}</td>
                        <td className="p-3 border text-right">{item.sao}</td>
                        <td className="p-3 border text-right">{item.sgo}</td>
                        <td className="p-3 border text-right font-semibold text-blue-600">{sao.toFixed(2)}</td>
                        <td className="p-3 border text-right font-semibold text-blue-600">{sgo.toFixed(2)}</td>
                        <td className="p-3 border text-right text-orange-500">{remainSAOSP.toFixed(2)}</td>
                        <td className="p-3 border text-right text-orange-500">{remainSGOSP.toFixed(2)}</td>
                        <td className={`p-3 border text-center font-bold rounded-lg ${status === "Complete" ? "text-green-600 " : "text-red-600 "}`}
                        >
                          {status}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-gray-500 font-medium">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-lg font-semibold text-gray-800 dark:text-white text-center mt-4">
        Total Steps: <span className="text-blue-600">{stepPendingData.length}</span>
      </p>
    </div>
  );
}
