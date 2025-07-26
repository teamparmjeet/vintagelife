"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Order({ id }) {
    const [showTable, setShowTable] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/order/userall/${id}`);
                setOrders(Array.isArray(response.data.data) ? response.data.data : []);
                setError(null);
            } catch (err) {
                setError("Failed to fetch orders. Please try again later.");
                console.error("Error fetching orders:", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        if (showTable && id) {
            fetchOrders();
        }
    }, [id, showTable]);

    return (
        <div className=" bg-gray-50">
            {!showTable ? (
                <button
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                    onClick={() => setShowTable(true)}
                >
                    Show Orders
                </button>
            ) : (
                <div className="space-y-4">
                    <button
                        className="w-full sm:w-auto bg-gradient-to-r from-gray-500 to-gray-600 text-white py-2 px-6 rounded-lg shadow-md hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
                        onClick={() => setShowTable(false)}
                    >
                        Hide Orders
                    </button>

                    {loading && (
                        <p className="text-center text-gray-600 animate-pulse">Loading orders...</p>
                    )}
                    {error && (
                        <p className="text-center text-red-500 bg-red-100 p-2 rounded-lg">{error}</p>
                    )}

                    {!loading && !error && orders.length > 0 && (
                        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                            <table className="w-full min-w-[800px]">
                                <thead className="bg-blue-600 text-white text-sm sm:text-base">
                                    <tr>
                                        <th className="px-3 py-2 text-left">Order No</th>
                                        <th className="px-3 py-2 text-left">Date</th>
                                        <th className="px-3 py-2 text-left">Product Details</th>
                                        <th className="px-3 py-2 text-left">Group</th>
                                        <th className="px-3 py-2 text-left">Sp</th>
                                        <th className="px-3 py-2 text-left">Amount</th>
                                        <th className="px-3 py-2 text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => (
                                        <tr
                                            key={order._id}
                                            className={`hover:bg-gray-100 transition-colors duration-200 ${
                                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                        >
                                            <td className="p-3 border-b text-sm sm:text-base">
                                                {order.orderNo}
                                            </td>
                                            <td className="p-3 border-b text-sm sm:text-base">
                                                {new Date(order.date).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="p-3 border-b text-sm sm:text-base">
                                                {order.productDetails.map((detail) => (
                                                    <div key={detail._id} className="mb-1">
                                                        <span className="font-medium text-indigo-600">
                                                            {detail.product}
                                                        </span>{" "}
                                                        - Qty:{" "}
                                                        <span className="text-green-600">
                                                            {detail.quantity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="p-3 border-b text-sm sm:text-base">
                                                {order.salegroup}
                                            </td>
                                            <td className="p-3 border-b text-sm sm:text-base">
                                                {order.totalsp}
                                            </td>
                                            <td className="p-3 border-b text-sm sm:text-base font-semibold text-gray-800">
                                                {order.netamount}
                                            </td>
                                            <td className="p-3 border-b text-sm sm:text-base">
                                                {order.status ? (
                                                    <span className="text-green-500">Verified</span>
                                                ) : (
                                                    <span className="text-red-500">Not Verified</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && !error && orders.length === 0 && (
                        <p className="text-center text-gray-500 bg-gray-100 p-4 rounded-lg">
                            No orders found.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
