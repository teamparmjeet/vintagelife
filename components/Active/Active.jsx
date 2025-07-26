"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

export default function Active({ userData }) {
  const [formData, setFormData] = useState({ activesp: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ New loading state

  const [saosp, setSaosp] = useState(0);
  const [sgosp, setSgosp] = useState(0);

  // Calculate earnsp from fetched states
  const earnsp = saosp + sgosp;
  const getOptions = () => {
    const options = [];
    if (earnsp >= 50) options.push(50);
    if (earnsp >= 100) options.push(100);
    return options;
  };

  useEffect(() => {
    if (!userData.dscode) return;

    const fetchData = async () => {
      setLoading(true);
      setErrorMessage(""); // fix: use setErrorMessage here, not setError

      try {
        const userRes = await axios.get(`/api/deactiveuserpanel/${userData.dscode}`);

        setSaosp(parseFloat(userRes.data.mainUser?.saosp || 0));
        setSgosp(parseFloat(userRes.data.mainUser?.sgosp || 0));
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData.dscode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const availableOptions = getOptions();

    if (availableOptions.length === 0) {
      setErrorMessage("You don't have sufficient SP to activate.");
      return;
    }

    if (!formData.activesp) {
      setErrorMessage("Please select an active SP.");
      return;
    }

    try {
      setLoading(true); 
      const { data: updatedData } = await axios.patch("/api/user/update-user/", {
        id: userData._id,
        activesp: formData.activesp,
        usertype: "1",
      });

      toast.success("Activated successfully!");
      setErrorMessage("");
      signOut();
    } catch (error) {
      console.error("Update failed:", error);
      setErrorMessage("Failed to update user");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-gray-50 rounded transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-white tracking-wide">
        Available RP: <span className="text-indigo-600">{earnsp}</span>
      </h2>
      <Toaster position="top-center" reverseOrder={false} />
      {errorMessage && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Active SP
          </label>
          <select
            name="activesp"
            value={formData.activesp}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-400 outline-none shadow-inner transition"
            required
            disabled={getOptions().length === 0 || loading} // ✅ Disable during loading
          >
            <option value="">Select SP</option>
            {getOptions().map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading} // ✅ Disable during loading
          className={`w-full ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white py-2.5 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg`}
        >
          {loading ? "Updating..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
