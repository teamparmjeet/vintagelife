"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Page() {
  const { data: session } = useSession();
  const [dsid, setDsid] = useState("");
  const [totals, setTotals] = useState({});
  const [tempFromDate, setTempFromDate] = useState(null);
  const [tempToDate, setTempToDate] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const formatDate = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchTotals = async (params = {}) => {
    try {
      const res = await axios.get("/api/account/get", { params });
      setTotals(res.data.totals || {});
      setDateRange({
        from: params.fromDate || "Start",
        to: params.toDate || "End",
      });
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        setDsid(res.data.dscode);
        fetchTotals({ dsid: res.data.dscode });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  const handleApply = () => {
    if (!dsid) return;

    const params = { dsid };
    if (tempFromDate) params.fromDate = formatDate(tempFromDate);
    if (tempToDate) params.toDate = formatDate(tempToDate);
    fetchTotals(params);
  };

  const handleReset = () => {
    setTempFromDate(null);
    setTempToDate(null);
    if (dsid) fetchTotals({ dsid });
  };

  return (
   <div className="p-4 max-w-7xl mx-auto">
  <h1 className="text-xl font-semibold mb-4 text-center">My Team Summary</h1>

  {/* Date Filter */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 text-sm">
    <div>
      <label className="block text-xs font-medium mb-1">From Date</label>
      <DatePicker
        selected={tempFromDate}
        onChange={(date) => setTempFromDate(date)}
        className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none"
        placeholderText="From"
        dateFormat="yyyy-MM-dd"
        maxDate={new Date()}
      />
    </div>
    <div>
      <label className="block text-xs font-medium mb-1">To Date</label>
      <DatePicker
        selected={tempToDate}
        onChange={(date) => setTempToDate(date)}
        className="w-full border border-gray-300 p-2 rounded text-sm focus:outline-none"
        placeholderText="To"
        dateFormat="yyyy-MM-dd"
        maxDate={new Date()}
      />
    </div>
    <div className="flex gap-2 items-end">
      <button
        onClick={handleApply}
        className="bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 w-full text-sm"
      >
        Apply
      </button>
      <button
        onClick={handleReset}
        className="bg-gray-300 text-gray-800 py-2 px-3 rounded hover:bg-gray-400 w-full text-sm"
      >
        Reset
      </button>
    </div>
  </div>

  {/* Summary Table */}
  <div className="overflow-x-auto text-sm">
    <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-md bg-white">
      <thead className="bg-blue-50 text-gray-700 text-sm">
        <tr>
          <th className="px-4 py-2 text-left border">From</th>
          <th className="px-4 py-2 text-left border">To</th>
          <th className="px-4 py-2 text-right border">Total SP</th>
          <th className="px-4 py-2 text-right border">SAO SP</th>
          <th className="px-4 py-2 text-right border">SGO SP</th>
          <th className="px-4 py-2 text-right border">Matching Income</th>
        </tr>
      </thead>
      <tbody>
        <tr className="hover:bg-blue-50 text-sm">
          <td className="px-4 py-2 border">{dateRange.from}</td>
          <td className="px-4 py-2 border">{dateRange.to}</td>
          <td className="px-4 py-2 border text-right">{totals.totalsp || 0}</td>
          <td className="px-4 py-2 border text-right">{totals.totalsaosp || 0}</td>
          <td className="px-4 py-2 border text-right">{totals.totalsgosp || 0}</td>
          <td className="px-4 py-2 border text-right">
            {(Math.min(Number(totals.totalsaosp || 0), Number(totals.totalsgosp || 0)) * 10).toFixed(2)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

  );
}
