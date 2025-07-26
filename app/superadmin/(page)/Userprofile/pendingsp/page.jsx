// File: Your page component (e.g., app/superadmin/pending-sp/page.js)

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image"; // Import the Next.js Image component

export default function Page() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Simplified fetchData function
  const fetchData = async () => {
    setLoading(true);
    try {
      // We make ONE API call to get all necessary user data for the current page
      // The '/1' is just a placeholder to match the dynamic route, the real logic uses query params
      const response = await axios.get("/api/dashboard/de/1", {
        params: {
          page,
          limit: 20, // You can adjust the limit
        },
      });

      if (response.data?.success) {
        setData(response.data.data || []);
        setTotalPages(response.data.totalPages);
      } else {
        throw new Error(response.data.message || "Failed to fetch data.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load users.");
      setData([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch data when the page number changes
  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Inactive Users with Pending SP
      </h1>

      {/* Search inputs have been removed for simplicity as requested */}

      {loading ? (
        <p className="text-gray-500">Loading data, please wait...</p>
      ) : error ? (
        <p className="text-red-600 font-medium">{error}</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded shadow-sm">
            <table className="min-w-full text-sm bg-white border border-gray-200">
              <thead className="bgw text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 border">Sr No</th>
                  {/* <th className="px-4 py-3 border">Image</th> */}
                  <th className="px-4 py-3 border">Name</th>
                  <th className="px-4 py-3 border">DS Code</th>
                  <th className="px-4 py-3 border">Parent DS Code</th>
                  <th className="px-4 py-3 border">Group</th>
                  <th className="px-4 py-3 border">Email</th>
                  <th className="px-4 py-3 border">Phone</th>
                  <th className="px-4 py-3 border">SAO SP</th>
                  <th className="px-4 py-3 border">SGO SP</th>
                  <th className="px-4 py-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={user._id} className="text-center hover:bg-gray-50">
                    <td className="px-4 py-2 border">{(page - 1) * 20 + index + 1}</td>
                    {/* <td className="px-4 py-2 border flex justify-center items-center">
                      <Image
                        src={user.image || "/default-avatar.png"} // Provide a fallback image
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </td> */}
                    <td className="px-4 py-2 border">{user.name}</td>
                    <td className="px-4 py-2 border font-mono">{user.dscode}</td>
                    <td className="px-4 py-2 border font-mono">{user.pdscode}</td>
                    <td className="px-4 py-2 border">{user.group}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.mobileNo}</td>
                    <td className="px-4 py-2 border text-green-600 font-semibold">{user.saosp}</td>
                    <td className="px-4 py-2 border text-indigo-600 font-semibold">{user.sgosp}</td>
                    <td className="px-4 py-2 border">
                      <Link
                        href={`/superadmin/Userprofile/user/${user.email}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}