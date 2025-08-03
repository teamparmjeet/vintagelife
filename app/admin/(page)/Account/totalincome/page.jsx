"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Page() {
  const { data: session, status } = useSession();
  const dscode = session?.user?.dscode;

  const [monthlyData, setMonthlyData] = useState([]);
  const [closingData, setClosingData] = useState([]);
  const [travelFundData, setTravelFundData] = useState([]);
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
      let url = `/api/userAccount/total/${String(dscode)}`;

      if (startDate && endDate) {
        const start = toUTCDateString(startDate);
        const end = toUTCDateString(endDate);
        url += `?startDate=${start}&endDate=${end}`;
      }

      axios
        .get(url)
        .then((res) => {
          setMonthlyData(res.data.monthlyData || []);
          setClosingData(res.data.closingData || []);
          setTravelFundData(res.data.travelFundData || []);
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

  const renderTable = (title, dataset) => {
    const totalAmount = dataset.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const totalCharges = dataset.reduce(
      (sum, item) => sum + Number(item.charges || 0),
      0
    );
    const totalPayAmount = dataset.reduce(
      (sum, item) => sum + Number(item.payamount || 0),
      0
    );

    return (
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-1">
          {title}
        </h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 border">Name</th>
                <th className="p-3 border text-right">Amount</th>
                <th className="p-3 border text-right">Charges</th>
                <th className="p-3 border text-right">Pay Amount</th>
                <th className="p-3 border">Status Approved Date</th>
              </tr>
            </thead>
            <tbody>
              {dataset.length > 0 ? (
                <>
                  {dataset.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="p-3 border">{item.name}</td>
                      <td className="p-3 border text-right">
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 border text-right">
                        ₹{Number(item.charges).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 border text-right">
                        ₹{Number(item.payamount).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 border text-gray-600">
                        {item.statusapprovedate
                          ? new Date(item.statusapprovedate).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="p-3 border">Total</td>
                    <td className="p-3 border text-right">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 border text-right">
                      ₹{totalCharges.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 border text-right">
                      ₹{totalPayAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 border">—</td>
                  </tr>
                </>
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
  };

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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Total Income
      </h1>

      {/* Date Filters */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
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
            className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all duration-200"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Tables */}
      {renderTable("Pair Income", closingData)}
      {renderTable("Royalty Income", monthlyData)}
      {renderTable("Travel Fund Income", travelFundData)}
    </div>
  );
}
