"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const [userdata, setUserData] = useState();
  const [data, setData] = useState([]);
  const [levelOrder, setLevelOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      try {
        const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        setUserData(response.data.level);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, [session?.user?.email]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/level/fetch/level");
        const sortedData = [...(response.data.data || [])].sort((a, b) => a.sao - b.sao);
        setData(sortedData);
        setLevelOrder(sortedData.map((item) => item.level_name));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatus = (levelName) => {
    const userIndex = levelOrder.indexOf(userdata);
    const levelIndex = levelOrder.indexOf(levelName);
    if (userIndex === -1 || levelIndex === -1) return "Pending";
    return levelIndex <= userIndex ? "Achieved" : "Pending";
  };

  const getStatusClass = (status) => {
    return status === "Achieved" ? "text-green-600 font-semibold" : "text-red-600 font-semibold";
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">My Trip List</h2>
      {userdata && <p className="mb-2">My Level: <span className="font-bold">{userdata}</span></p>}

      {loading ? (
        <div className="text-center py-8 text-gray-500 text-lg animate-pulse">Loading trips...</div>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 text-center py-2">Rank No.</th>
              <th className="border border-gray-300 px-3 text-center py-2">Level</th>
              <th className="border border-gray-300 px-3 text-center py-2">Trip Name</th>
              <th className="border border-gray-300 px-3 text-center py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => {
                if (!item.tour) return null;

                const status = getStatus(item.level_name);
                return (
                  <tr key={index}>
                    {/* Show the original data index + 1 here as Level No. */}
                    <td className="border text-gray-600 text-center border-gray-300 px-3 py-2">{index + 1}</td>
                    <td className="border text-gray-600 text-center border-gray-300 px-3 py-2">{item.level_name}</td>
                    <td className="border text-gray-600 text-center border-gray-300 px-3 py-2">{item.tour}</td>
                    <td className={`border text-center border-gray-300 px-3 py-2 ${getStatusClass(status)}`}>
                      {status}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500 font-medium">
                  No data found.
                </td>
              </tr>
            )}


          </tbody>
        </table>
      )}
    </div>
  );
}
