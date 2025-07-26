"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBonanza, setSelectedBonanza] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch Bonanza Data
  useEffect(() => {
    const fetchBonanza = async () => {
      try {
        const response = await axios.get("/api/bonanza/fetch/bonanza");
        setData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching Bonanza data:", error);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBonanza();
  }, []);

  // Fetch Users for Dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user/fethall/user");
        setUsers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const openModal = (bonanza) => {
    setSelectedBonanza(bonanza);
    setIsModalOpen(true);
    setSelectedUser("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBonanza(null);
    setSelectedUser("");
  };

  const handleUpdate = async () => {
    if (!selectedBonanza || !selectedUser) return;

    const updatedData = {
      achiversDetails: [
        ...selectedBonanza.achiversDetails,
        { dscode: selectedUser, date: new Date().toISOString().split("T")[0] },
      ],
    };

    try {
      const response = await axios.patch(`/api/bonanza/update/${selectedBonanza._id}`, updatedData);
      if (response.data.success) {
        setData((prevData) =>
          prevData.map((item) =>
            item._id === selectedBonanza._id ? { ...item, ...response.data.data } : item
          )
        );
        closeModal();
      }
    } catch (error) {
      console.error("Error updating Bonanza:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this Bonanza?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`/api/bonanza/delete/${id}`);
      if (response.data.success) {
        setData((prevData) => prevData.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.error("Error deleting Bonanza:", error);
    }
  };

  return (
    <div className="lg:p-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-6">
        🌟 Bonanza Achievers List
      </h2>

      {loading ? (
        <div className="h-96 flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-7 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-md">
          <table className="w-full border border-gray-200 dark:border-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-left">
                <th className="py-3 px-4 border-r">#</th>
                <th className="py-3 px-4 border-r">Image</th>
                <th className="py-3 px-4 border-r">Title</th>
                <th className="py-3 px-4 border-r">Achievers</th>
                <th className="py-3 px-4 border-r">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="border-b bg-white hover:bg-gray-100 text-black dark:text-white transition duration-200">
                    <td className="py-3 text-sm font-medium px-4 border-r">{index + 1}</td>
                    <td className="py-3 px-4 border-r">
                      <Link href={item.image} target="_blank">
                        <Image src={item.image} alt="Bonanza" width={50} height={50} className="rounded-md shadow-md" />
                      </Link>
                    </td>
                    <td className="py-3 px-4 border-r">{item.title}</td>
                    <td className="py-3 px-4 border-r">
                      {item.achiversDetails.map((achiever, i) => (
                        <p key={i} className="text-xs bg-gray-200 px-2 py-1 rounded-md inline-block m-1">
                          {achiever.dscode} - {achiever.date}
                        </p>
                      ))}
                    </td>
                    <td className="py-3 px-4 flex gap-3">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
                        onClick={() => openModal(item)}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 font-medium">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Modal */}
      {isModalOpen && selectedBonanza && (
        <div className="fixed inset-0  flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🔄 Update Bonanza</h3>

            <label className="block text-gray-700 font-medium">Select User</label>
            <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} className="w-full border rounded-md p-2 mt-2">
              <option value="">-- Select User --</option>
              {users
                .filter((user) => !selectedBonanza.achiversDetails.some((achiever) => achiever.dscode === user.dscode))
                .map((user) => (
                  <option key={user._id} value={user.dscode}>
                    {user.name} ({user.dscode})
                  </option>
                ))}
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition">
                Cancel
              </button>
              <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
