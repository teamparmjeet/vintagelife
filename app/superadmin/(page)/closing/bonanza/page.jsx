"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBonanzaData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/newclosing/bonanza");
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Failed to fetch bonanza data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBonanzaData();
  }, []);

  const handleDownloadExcel = () => {
    const wsData = [
      [
        "Sr No.",
        "Username",
        "DSID",
        "Mobile",
        "Prev. SaoRp",
        "Prev. SgoRp",
        "Require SaoRp",
        "Require SgoRp",
        "Current SaoRp",
        "Current SgoRp",
      ],
      ...users.map((user, index) => [
        index + 1,
        user.username,
        user.dsid,
        user.mobile,
        user.previousSaosp,
        user.previousSgosp,
        user.requiredAddSao,
        user.requiredAddSgo,
        user.totalTargetSaosp,
        user.totalTargetSgosp,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bonanza Users");
    XLSX.writeFile(workbook, "Bonanza_Qualified_Users.xlsx");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Bonanza Closing</h1>
        <button
          onClick={handleDownloadExcel}
          disabled={loading || users.length === 0}
          className={`px-5 py-2 text-sm rounded-md transition-all shadow-md ${
            loading || users.length === 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? "Loading..." : "Download Excel"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">Fetching bonanza data...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-red-500 text-sm">No users found.</div>
      ) : (
        <div className="w-full overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-[1100px] w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs text-gray-700 uppercase sticky top-0">
              <tr>
                <th className="py-3 px-4">Sr. No.</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">DSID</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Prev. SaoRp</th>
                <th className="py-3 px-4">Prev. SgoRp</th>
                <th className="py-3 px-4">Require SaoRp</th>
                <th className="py-3 px-4">Require SgoRp</th>
                <th className="py-3 px-4">Current SaoRp</th>
                <th className="py-3 px-4">Current SgoRp</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={idx}
                  className="bg-white border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-4 whitespace-nowrap">{idx + 1}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{user.username}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{user.dsid}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{user.mobile}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{user.previousSaosp}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{user.previousSgosp}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{user.requiredAddSao}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{user.requiredAddSgo}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{user.totalTargetSaosp}</td>
                  <td className="py-2 px-4 whitespace-nowrap">{user.totalTargetSgosp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
