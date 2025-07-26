"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export default function Page() {
  const [rankAchievers, setRankAchievers] = useState([]);
  const [availableRanks, setAvailableRanks] = useState(["All Ranks"]);
  const [selectedRank, setSelectedRank] = useState("All Ranks");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRankAchievers = async () => {
      try {
        const response = await axios.get("/api/achivers/fetchbytype/Rank Achiever");
        const achieversData = response.data.data || [];

        // Extract unique ranks and add "All Ranks"
        const ranks = ["All Ranks", ...new Set(achieversData.map((item) => item.ranktype))];

        setRankAchievers(achieversData);
        setAvailableRanks(ranks);
      } catch (error) {
        console.error("Error fetching Rank achievers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankAchievers();
  }, []);

  // Filtering logic: Show all when "All Ranks" is selected
  const filteredAchievers =
    selectedRank === "All Ranks"
      ? rankAchievers
      : rankAchievers.filter((achiever) => achiever.ranktype === selectedRank);

  const totalPages = Math.ceil(filteredAchievers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredAchievers.slice(startIndex, startIndex + itemsPerPage);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAchievers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rank Achievers");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "RankAchievers.xlsx");
  };

  return (
    <div className="mx-auto lg:p-6 p-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg text-gray-700 dark:text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Rank Achiever List</h2>

      {/* Rank Selection Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Select Rank</label>
        <select
          value={selectedRank}
          onChange={(e) => {
            setSelectedRank(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
        >
          {availableRanks.map((rank) => (
            <option key={rank} value={rank}>
              {rank}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-600">
              <th className="border border-gray-300 px-4 py-2">Sno</th>
              <th className="border border-gray-300 px-4 py-2">DS ID</th>
              <th className="border border-gray-300 px-4 py-2">DS Name</th>
              <th className="border border-gray-300 px-4 py-2">City</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((achiever, index) => (
              <tr key={achiever._id} className="text-center bg-white dark:bg-gray-800">
                <td className="border border-gray-300 px-4 py-2">{startIndex + index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{achiever.dsid}</td>
                <td className="border border-gray-300 px-4 py-2">{achiever.name}</td>
                <td className="border border-gray-300 px-4 py-2">{achiever.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Export to Excel Button */}
      <button
        onClick={exportToExcel}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-40"
      >
        Export to Excel
      </button>
    </div>
  );
}
