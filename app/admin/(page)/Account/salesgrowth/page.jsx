"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Page() {
  const { data: session, status } = useSession();

  const [data, setData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [saorp, setSaorp] = useState(0);
  const [sgorp, setSgorp] = useState(0);
  const [totalBonus, setTotalBonus] = useState(0);
  const [totalPerformance, setTotalPerformance] = useState(0);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const fetchData = async () => {
    const dscode = session?.user?.dscode;
    if (!dscode) return;

    try {
      const params = new URLSearchParams();
      if (fromDate) params.append("from", fromDate.toISOString());
      if (toDate) params.append("to", toDate.toISOString());

      const res = await axios.get(`/api/PaymentHistory/user/${dscode}?${params}`);
      const records = res.data.data;

      setData(records);

      let total = 0;
      let sao = 0;
      let sgo = 0;
      let bonusSum = 0;
      let perfSum = 0;

      records.forEach((item) => {
        const bonus = parseFloat(item.bonus_income || 0);
        const perf = parseFloat(item.performance_income || 0);
        const sp = parseFloat(item.sp || 0);

        total += bonus + perf + sp;
        bonusSum += bonus;
        perfSum += perf;

        if (item.group === "SAO") sao += sp;
        if (item.group === "SGO") sgo += sp;
      });

      setTotalIncome(total);
      setSaorp(sao);
      setSgorp(sgo);
      setTotalBonus(bonusSum);
      setTotalPerformance(perfSum);
    } catch (err) {
      console.error("Error fetching payment data:", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, session]);

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="p-6 overflow-x-auto">
      {/* Date Filters */}
      <div className="mb-4 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border px-3 py-1 rounded w-full"
            placeholderText="Select start date"
            maxDate={new Date()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border px-3 py-1 rounded w-full"
            placeholderText="Select end date"
            maxDate={new Date()}
          />
        </div>
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filter
        </button>
      </div>

      {/* Summary Table */}
      <div className="mb-4">
        <table className="min-w-full text-sm text-left border border-gray-300 bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Pair Matching Income</th>
              <th className="px-4 py-2 border">Total Bonus Income</th>
              <th className="px-4 py-2 border">Total Performance Income</th>
              <th className="px-4 py-2 border">Total </th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-gray-800">
              <td className="px-4 py-2 border text-green-700">₹{Math.min(saorp, sgorp) * 10}</td>
              <td className="px-4 py-2 border text-blue-700">₹{totalBonus}</td>
              <td className="px-4 py-2 border text-purple-700">₹{totalPerformance}</td>
              <td className="px-4 py-2 border font-semibold text-black">
        ₹
        {Math.min(saorp, sgorp) * 10 + totalBonus + totalPerformance}
      </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Main Data Table */}
      <table className="min-w-full text-sm text-left border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 border">#</th>
            {/* <th className="px-4 py-2 border">Group</th> */}
            <th className="px-4 py-2 border">Rp</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Reference Name</th>
            <th className="px-4 py-2 border">Bonus Income</th>
            <th className="px-4 py-2 border">Performance Income</th>
            <th className="px-4 py-2 border">SP</th>
            <th className="px-4 py-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item._id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 border">{index + 1}</td>
              {/* <td className="px-4 py-2 border">{item.group}</td> */}
              <td className="px-4 py-2 border">{item.sp}</td>
              <td className="px-4 py-2 border">{item.type}</td>
              <td className="px-4 py-2 border">{item.referencename || "-"}</td>
              <td className="px-4 py-2 border">₹{item.bonus_income || 0}</td>
              <td className="px-4 py-2 border">₹{item.performance_income || 0}</td>
              <td className="px-4 py-2 border">{item.sp || 0}</td>
              <td className="px-4 py-2 border">
                {new Date(item.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          <tr className="font-semibold bg-gray-50">
            <td colSpan={4} className="px-4 py-2 border text-right">Totals:</td>
            <td className="px-4 py-2 border text-green-700">₹{totalBonus}</td>
            <td className="px-4 py-2 border text-blue-700">₹{totalPerformance}</td>
            <td className="px-4 py-2 border text-purple-700"></td>
            <td className="px-4 py-2 border"></td>
            <td className="px-4 py-2 border"></td>
          </tr>
        </tbody>
      </table>

      {/* <div className="mt-4 space-y-2 text-sm text-gray-700">
        <div><span className="font-medium">SAO RP:</span> ₹{saorp}</div>
        <div><span className="font-medium">SGO RP:</span> ₹{sgorp}</div>
      </div> */}
    </div>
  );
}
