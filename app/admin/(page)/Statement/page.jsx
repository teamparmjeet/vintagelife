"use client"
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function Statement() {
  const { data: session } = useSession();
  const [userdscode, setUserdscode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (!session?.user?.email) return;
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        setUserdscode(response.data.dscode);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, [session?.user?.email]);

  const fetchData = async () => {
    if (!userdscode) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/statement/statement/${userdscode}`, {
        params: { dateFrom, dateTo },
      });

      const fetchedData = response.data?.data || [];
      setData(fetchedData);
      setFilteredData(fetchedData);
      calculateTotalIncome(fetchedData);
    } catch (error) {
      console.error("Error fetching statement data:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    setDateFrom("");
    setDateTo("");
    setData([]); // Clear data on reset
    setFilteredData([]);
    setTotalIncome(0);
  };

  const calculateTotalIncome = (data) => {
    const income = data.reduce((sum, entry) => sum + (entry.totalsp * 10), 0);
    setTotalIncome(income);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, " Statement");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Statement.xlsx");
  };

  return (
    <div className="mx-auto lg:p-6 p-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg text-gray-700 dark:text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center"> Statement</h2>
      <p className="text-lg font-bold mb-4 text-center">Total Income: ₹{totalIncome}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium">Date From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            onClick={(e) => e.target.showPicker()}
            className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            onClick={(e) => e.target.showPicker()}
            max={new Date().toISOString().split("T")[0]}
            className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white cursor-pointer"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-lg"
        >
          Show
        </button>
        <button
          onClick={resetFilter}
          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-lg"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="text-center p-4 text-gray-500">Loading...</div>
      ) : filteredData.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden mt-4">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-600">
              <th className="border border-gray-300 px-4 py-2">SN NO.</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Total Sp</th>
              <th className="border border-gray-300 px-4 py-2">Total Income</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry, index) => (
              <tr key={index} className="text-center bg-white dark:bg-gray-800">
                <td className="border border-gray-300 px-4 py-2">{index+1}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(entry.createdAt).toLocaleDateString("en-GB")}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.totalsp}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.totalsp * 10}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center p-4 text-gray-500">No Data Found</p>
      )}

      {filteredData.length > 0 && (
        <button onClick={exportToExcel} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Export to Excel
        </button>
      )}
    </div>
  );
}
