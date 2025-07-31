"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function UpdateUserPage() {
  const { id } = useParams();
  const email = decodeURIComponent(id);

  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/user/find-admin-byemail/${email}`);
      setUserData(res.data);
      setFormData(res.data);
    } catch (err) {
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { ...formData, id: formData._id };
      await axios.patch("/api/user/update/", updateData);
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error("Update failed!");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!userData) return <p className="p-6 text-center text-red-500">User not found</p>;

  return (
    <div className=" mx-auto px-4 py-8 bg-white shadow-md rounded-xl mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Update User</h2>
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* PERSONAL INFORMATION */}
        <div>
          <h3 className="text-lg font-semibold mb-4 textn">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
            <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Mobile No" name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
            <Input label="WhatsApp No" name="whatsappNo" value={formData.whatsappNo} onChange={handleChange} />
            <Input label="Gender" name="gender" value={formData.gender} onChange={handleChange} />
            <Input label="Date of Birth" name="dob" type="date" value={formData.dob?.split("T")[0] || ""} onChange={handleChange} />
          </div>
        </div>

        {/* DOCUMENTS */}
        <div>
          <h3 className="text-lg font-semibold mb-4 textn">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="PAN Number" name="panno" value={formData.panno} onChange={handleChange} />
            <Input label="Aadhar Number" name="aadharno" value={formData.aadharno} onChange={handleChange} />
          </div>
        </div>

        {/* NOMINEE */}
        <div>
          <h3 className="text-lg font-semibold mb-4 textn">Nominee Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Nominee Name" name="nomineeName" value={formData.nomineeName} onChange={handleChange} />
            <Input label="Nominee Relation" name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} />
            <Input label="Nominee DOB" name="nomineeDOB" type="date" value={formData.nomineeDOB?.split("T")[0] || ""} onChange={handleChange} />
          </div>
        </div>

        {/* ADDRESS */}
        <div>
          <h3 className="text-lg font-semibold mb-4 textn">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Address Line 1" name="addressLine1" value={formData.address?.addressLine1 || ""} onChange={handleAddressChange} />
            <Input label="Address Line 2" name="addressLine2" value={formData.address?.addressLine2 || ""} onChange={handleAddressChange} />
            <Input label="City" name="city" value={formData.address?.city || ""} onChange={handleAddressChange} />
            <Input label="Landmark" name="landmark" value={formData.address?.landmark || ""} onChange={handleAddressChange} />
            <Input label="Pin Code" name="pinCode" value={formData.address?.pinCode || ""} onChange={handleAddressChange} />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                name="state"
                value={formData.address?.state || ""}
                onChange={handleAddressChange}
                className="w-full rounded border border-gray-300 px-3 py-0.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a state</option>
                {[
                  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
                  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
                  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
                  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
                  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
                  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
                  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
                ].map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* SUBMIT */}
        <div className="text-center">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-200">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable input component
const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm text-gray-700 font-medium mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value || ""}
      onChange={onChange}
      className="border text-sm border-gray-300 rounded px-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  </div>
);
