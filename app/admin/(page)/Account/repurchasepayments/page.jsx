"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Page() {
  const { data: session } = useSession();
  const [userdscode, setUserdscode] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Controlled filter state to apply on button click
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `/api/user/find-admin-byemail/${session.user.email}`
        );
        setUserdscode(response.data.dscode);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  useEffect(() => {
    if (!userdscode) return;

    const fetchOrders = async () => {
      setLoading(true);

      try {
        let url = `/api/account/repurchase/${userdscode}`;
        const params = [];

        if (filterFromDate) {
          const from = new Date(filterFromDate);
          from.setHours(0, 0, 0, 0);
          params.push(`dateFrom=${from.toISOString().split("T")[0]}`);
        }

        if (filterToDate) {
          const to = new Date(filterToDate);
          to.setHours(23, 59, 59, 999);
          params.push(`dateTo=${to.toISOString().split("T")[0]}`);
        }

        if (params.length) {
          url += `?${params.join("&")}`;
        }

        const res = await axios.get(url);
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userdscode, filterFromDate, filterToDate]);

  // Handler for Apply button
  const handleApply = () => {
    setFilterFromDate(fromDate);
    setFilterToDate(toDate);
  };

  // Handler for Clear Filters button
  const handleClear = () => {
    setFromDate(null);
    setToDate(null);
    setFilterFromDate(null);
    setFilterToDate(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 underline">Repurchase</h2>

      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label className="block mb-1 font-medium text-gray-700">From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-500 px-2 py-1 w-40 text-gray-800"
            placeholderText="Select start date"
            maxDate={new Date()}
            isClearable
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-500 px-2 py-1 w-40 text-gray-800"
            placeholderText="Select end date"
            maxDate={new Date()}
            isClearable
          />
        </div>

        <div>
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>

        <div>
          <button
            onClick={handleClear}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-400 text-left text-gray-800">
            <thead className="bg-gray-100 border-b border-gray-400">
              <tr>
                <th className="px-4 py-2 border-r">S. No.</th>
                <th className="px-4 py-2 border-r">Order No</th>
                <th className="px-4 py-2 border-r">Order Date</th>
                <th className="px-4 py-2 border-r">Amount</th>
                <th className="px-4 py-2 border-r">Sp</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order._id}
                  className="border-t border-gray-300 hover:bg-gray-50"
                >
                  <td className="px-4 py-2 border-r">{index + 1}</td>
                  <td className="px-4 py-2 border-r">{order.orderNo}</td>
                  <td className="px-4 py-2 border-r">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-r text-green-700 font-semibold">
                    ₹{parseFloat(order.netamount).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{parseFloat(order.totalsp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No orders found after activation date.</p>
      )}
    </div>
  );
}
