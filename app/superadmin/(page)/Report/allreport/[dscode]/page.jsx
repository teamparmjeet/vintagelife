"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Dashboard1 from "@/components/Adminuser/Dashboard1";
import Dashboard3 from "@/components/Adminuser/Dashboard3";
import Dashboard4 from "@/components/Adminuser/Dashboard4";

export default function Page() {
  const { dscode } = useParams();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filterDates, setFilterDates] = useState({ from: null, to: null });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Prevent hydration mismatch
    setMounted(true);
  }, []);

  const handleFilter = () => {
    setFilterDates({ from: fromDate, to: toDate });
  };

  if (!mounted) return null; // Skip rendering until after client mount

  return (
    <div className="p-6 space-y-6">
      {/* Date Filter UI */}
      <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            selectsStart
            startDate={fromDate}
            endDate={toDate}
            className="border px-3 py-2 rounded-md shadow-sm"
            placeholderText="Select start date"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-1">To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            selectsEnd
            startDate={fromDate}
            endDate={toDate}
            minDate={fromDate}
            className="border px-3 py-2 rounded-md shadow-sm"
            placeholderText="Select end date"
          />
        </div>

        <button
          onClick={handleFilter}
          className="mt-2 sm:mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Filter
        </button>
      </div>

      {/* Dashboard Components */}
      <Dashboard1 dscode={dscode} fromDate={filterDates.from} toDate={filterDates.to} />
      <Dashboard3 dscode={dscode}/>
      <Dashboard4 dscode={dscode} fromDate={filterDates.from} toDate={filterDates.to} />
    </div>
  );
}
