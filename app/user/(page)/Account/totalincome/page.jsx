"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function normalizeDate(dateStr) {
  if (!dateStr) return "";
  if (dateStr.includes("-")) return dateStr;

  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return dateStr;
}

function formatDate(date) {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Page() {
  const { data: session } = useSession();
  const [rawData, setRawData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [dsid, setDsid] = useState("");
  const [totals, setTotals] = useState({});
  const [dateRange, setDateRange] = useState({ from: "Start", to: "End" });

  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        console.log("Admin API response:", res.data);
        const code = res.data.dscode;
        setDsid(code);

        const totalsRes = await axios.get("/api/account/get", { params: { dsid: code } });
        console.log("Totals API response:", totalsRes.data);
        setTotals(totalsRes.data.totals || {});
        setDateRange({
          from: totalsRes.data.totals?.fromDate || "Start",
          to: totalsRes.data.totals?.toDate || "End",
        });

        if (Array.isArray(res.data.WalletDetails) && res.data.WalletDetails.length > 0) {
          setRawData(res.data.WalletDetails);
        } else {
          setRawData([]); // explicitly clear if no data
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.email]);

  useEffect(() => {
    // If no rawData but totals exist, show a single summary row
    if ((!rawData || rawData.length === 0) && totals) {
      const matchingIncome = Math.min(
        Number(totals.totalsaosp || 0),
        Number(totals.totalsgosp || 0)
      ) * 10;

      setFilteredData([
        {
          id: 1,
          from: totals.fromDate || "Start",
          to: totals.toDate || "End",
          salesgrowth: 0,
          performance: 0,
          matchingIncome,
          amount: matchingIncome,
        },
      ]);
      return;
    }

    // Otherwise, group rawData by normalized date and compute sums
    const grouped = {};
    rawData.forEach((item) => {
      const normDate = normalizeDate(item.date);
      const sg = parseFloat(item.salesgrowth || 0);
      const perf = parseFloat(item.performance || 0);

      if (!grouped[normDate]) {
        grouped[normDate] = { salesgrowth: 0, performance: 0 };
      }

      grouped[normDate].salesgrowth += sg;
      grouped[normDate].performance += perf;
    });

    let result = Object.entries(grouped).map(([date, values], index) => {
      const matchingIncome = Math.min(
        Number(totals.totalsaosp || 0),
        Number(totals.totalsgosp || 0)
      ) * 10;

      return {
        id: index + 1,
        from: date,
        to: date,
        salesgrowth: values.salesgrowth,
        performance: values.performance,
        matchingIncome,
        amount: values.salesgrowth + values.performance + matchingIncome,
      };
    });

    // Filter by date range if set
    if (fromDate || toDate) {
      result = result.filter((entry) => {
        const entryDate = new Date(entry.from);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from) from.setHours(0, 0, 0, 0);
        if (to) to.setHours(23, 59, 59, 999);

        return (!from || entryDate >= from) && (!to || entryDate <= to);
      });
    }

    // Sort descending by date
    result.sort((a, b) => (a.from < b.from ? 1 : -1));

    setFilteredData(result);
  }, [rawData, fromDate, toDate, totals]);

  const exportToExcel = () => {
    const csvRows = [
      ["S.No", "From", "To", "Sales Growth", "Performance", "Matching Income", "Amount (₹)"],
      ...filteredData.map((item) => [
        item.id,
        item.from,
        item.to,
        item.salesgrowth.toFixed(2),
        item.performance.toFixed(2),
        item.matchingIncome.toFixed(2),
        item.amount.toFixed(2),
      ]),
    ];

    const csvString = csvRows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "total_income.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDateFilter = () => {
    if (!dsid) return;

    const params = { dsid };
    if (fromDate) params.fromDate = formatDate(fromDate);
    if (toDate) params.toDate = formatDate(toDate);

    axios
      .get("/api/account/get", { params })
      .then((res) => {
        setTotals(res.data.totals || {});
        setDateRange({
          from: params.fromDate || "Start",
          to: params.toDate || "End",
        });
      })
      .catch((err) => {
        console.error("Error fetching totals:", err);
        toast.error("Failed to fetch filtered totals");
      });
  };

  return (
    <div className="p-4 md:p-6 text-sm">
      <Toaster />
      <h1 className="text-xl md:text-2xl text-blue-400 border-b pb-2 mb-4 capitalize">
        Total Income Summary
      </h1>

      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700">From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            onBlur={handleDateFilter}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-500 px-2 py-1 w-40 text-gray-800"
            placeholderText="Select date"
            maxDate={new Date()}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            onBlur={handleDateFilter}
            dateFormat="yyyy-MM-dd"
            className="border border-gray-500 px-2 py-1 w-40 text-gray-800"
            placeholderText="Select date"
            maxDate={new Date()}
          />
        </div>

        {(fromDate || toDate) && (
          <button
            onClick={() => {
              setFromDate(null);
              setToDate(null);
              axios
                .get("/api/account/get", { params: { dsid } })
                .then((res) => {
                  setTotals(res.data.totals || {});
                  setDateRange({ from: "Start", to: "End" });
                });
            }}
            className="text-red-600 underline text-sm"
          >
            Clear Filters
          </button>
        )}

        <button
          onClick={exportToExcel}
          className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-1 border border-green-800"
        >
          Export to Excel
        </button>
      </div>

      {loading ? (
        <div className="text-center text-blue-600 py-10 text-lg font-medium">
          Loading data, please wait...
        </div>
      ) : filteredData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-400 text-left text-gray-800">
            <thead className="bg-gray-100 border-b border-gray-400">
              <tr>
                <th className="px-4 py-2 border-r">S. No.</th>
                <th className="px-4 py-2 border-r">From</th>
                <th className="px-4 py-2 border-r">To</th>
                <th className="px-4 py-2 border-r">Sales Growth</th>
                <th className="px-4 py-2 border-r">Performance</th>
                <th className="px-4 py-2 border-r">Matching Income</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id} className="border-t border-gray-300 hover:bg-gray-50">
                  <td className="px-4 py-2 border-r">{index + 1}</td>
                  <td className="px-4 py-2 border-r">{item.from}</td>
                  <td className="px-4 py-2 border-r">{item.to}</td>
                  <td className="px-4 py-2 border-r text-blue-600">
                    ₹{item.salesgrowth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 border-r text-purple-600">
                    ₹{item.performance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 border-r text-orange-600">
                    ₹{item.matchingIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-2 text-green-700 font-semibold">
                    ₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-600">No data available for the selected filters.</div>
      )}
    </div>
  );
}
