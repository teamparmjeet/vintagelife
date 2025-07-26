"use client";
import React, { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function Page() {
  const [formData, setFormData] = useState({
    dsid: "",
    amount: "",
    tds: "",
    payamount: "",
    accountholder: "",
    accountNumber: "",
    ifsc: "",
    bankname: "",
    branch: "",
    bankreferencenumber: "",
    status: "0",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      const amount = parseFloat(value) || 0;
      const tds = (amount * 0.05).toFixed(2);
      const payamount = (amount - tds).toFixed(2);

      setFormData((prev) => ({
        ...prev,
        amount: value,
        tds,
        payamount,
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/Payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("✅ Payment created successfully.");
        setIsSuccess(true);
        setFormData({
          dsid: "",
          amount: "",
          tds: "",
          payamount: "",
          accountholder: "",
          accountNumber: "",
          ifsc: "",
          bankname: "",
          branch: "",
          bankreferencenumber: "",
          status: "0",
        });
      } else {
        setMessage("❌ Failed to create payment.");
        setIsSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error while creating payment.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          💳 Payment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 grid grid-cols-2 gap-4">
          {Object.entries(formData).map(([key, value]) =>
            key !== "status" ? (
              <div key={key} className=" col-span-1">
                <label className="block mb-1 font-medium capitalize text-gray-700">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required
                  readOnly={key === "tds" || key === "payamount"}
                  className={`w-full border px-3 py-2 rounded-lg ${key === "tds" || key === "payamount"
                    ? "bg-gray-100 border-gray-300 text-gray-500"
                    : "border-gray-300"
                    }`}
                />
              </div>
            ) : (
              <div key={key}>
                <label className="block mb-1 font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="0">Pending</option>
                  <option value="1">Paid</option>
                </select>
              </div>
            )
          )}
          {message && (
            <div
              className={`mt-6 p-4 col-span-2 rounded-lg flex items-center gap-2 ${isSuccess ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
            >
              {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
          <button
            type="submit"
            className="w-full col-span-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Submit Payment
          </button>
        </form>


      </div>
    </div>
  );
}
