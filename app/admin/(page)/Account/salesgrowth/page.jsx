"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Page() {
  const { data: session, status } = useSession();
  const dscode = session?.user?.dscode;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const toUTCDateString = (date) => {
    if (!date) return "";
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
      .toISOString()
      .split("T")[0];
  };

  const fetchData = () => {
    if (dscode) {
      setLoading(true);
      let url = `/api/userAccount/pair/${String(dscode)}`;

      if (startDate && endDate) {
        const start = toUTCDateString(startDate);
        const end = toUTCDateString(endDate);
        url += `?startDate=${start}&endDate=${end}`;
      }

      axios
        .get(url)
        .then((res) => {
          setData(res.data.data || []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [dscode]);

  if (status === "loading" || loading) {
    return (
      <div className="p-6 flex justify-center items-center h-40 text-lg font-medium text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 border-b pb-2">
        Pair Income
      </h1>

      {/* Date Filters */}
      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-300 px-3 py-2 rounded-lg w-44 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-300 px-3 py-2 rounded-lg w-44 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={fetchData}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-blue-50 text-gray-700">
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Amount</th>
              <th className="p-3 border">Charges</th>
              <th className="p-3 border">Pay Amount</th>
              <th className="p-3 border">Status Approved Date</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="p-3 border text-gray-800">{item.name}</td>
                  <td className="p-3 border text-gray-800">
                    ₹{parseFloat(item.amount).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 border text-gray-800">
                    ₹{parseFloat(item.charges).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 border text-gray-800">
                    ₹{parseFloat(item.payamount).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 border text-gray-600">
                    {item.statusapprovedate
                      ? new Date(item.statusapprovedate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="p-3 border text-center text-gray-500"
                  colSpan="5"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
