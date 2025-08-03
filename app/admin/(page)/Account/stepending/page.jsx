"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import steppending from "@/constanst/StepPending";

export default function Page() {
  const { data: session } = useSession();
  const [userdata, setUserData] = useState({ saosp: "0.00", sgosp: "0.00" });
  const [dsid, setDsid] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch DSID from user email
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      try {
        const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        setDsid(response.data);
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, [session?.user?.email]);


  const tableRows = useMemo(() => {
    let saoLeft = parseFloat(dsid.saosp || "0");
    let sgoLeft = parseFloat(dsid.sgosp || "0");

    return steppending.map((data, index) => {
      const totalSAO = parseFloat(data.sao);
      const totalSGO = parseFloat(data.sgo);

      const userSAO = parseFloat(dsid.saosp || "0");
      const userSGO = parseFloat(dsid.sgosp || "0");

      const usedSAO = Math.min(saoLeft, totalSAO);
      const usedSGO = Math.min(sgoLeft, totalSGO);

      const remainSAO = (totalSAO - usedSAO).toFixed(2);
      const remainSGO = (totalSGO - usedSGO).toFixed(2);
      const isComplete = remainSAO === "0.00" && remainSGO === "0.00";

      saoLeft -= usedSAO;
      sgoLeft -= usedSGO;

      return (
        <tr key={index}>
          <td className="border text-center px-3 py-2">{index + 1}</td>
          <td className="border  font-semibold px-3 py-2">{data.level}</td>

          <td className="border text-center px-3 py-2">{totalSAO.toFixed(2)}</td>
          <td className="border text-center px-3 py-2">{totalSGO.toFixed(2)}</td>
          <td className="border text-center px-3 py-2">{userSAO.toFixed(2)}</td>
          <td className="border text-center px-3 py-2">{userSGO.toFixed(2)}</td>
          <td className="border text-center px-3 py-2">{remainSAO}</td>
          <td className="border text-center px-3 py-2">{remainSGO}</td>
          <td className={`border px-3 py-2 text-center font-medium ${isComplete ? "text-green-600" : "text-red-600"}`}>
            {isComplete ? "Complete" : "Pending"}
          </td>
        </tr>
      );
    });
  }, [dsid]);

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Step Pending</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading data...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <table className="min-w-full border border-gray-300 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-center">Step</th>
              <th className="border px-3 py-2 text-center">Level</th>
              <th className="border px-3 py-2 text-center">TotalSAOSP</th>
              <th className="border px-3 py-2 text-center">TotalSGOSP</th>
              <th className="border px-3 py-2 text-center">SAOSP</th>
              <th className="border px-3 py-2 text-center">SGOSP</th>
              <th className="border px-3 py-2 text-center">RemainSAOSP</th>
              <th className="border px-3 py-2 text-center">RemainSGOSP</th>
              <th className="border px-3 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      )}
    </div>
  );
}
