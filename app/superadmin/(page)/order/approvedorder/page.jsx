"use client";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import OrderDetails from "@/components/OrderDetails/OrderDetails";

export default function PendingOrders() {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [orderNoFilter, setOrderNoFilter] = useState("");
    const [dscodeFilter, setDscodeFilter] = useState("");
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoadingOrders(true);
            try {
                const response = await fetch(`/api/order/fetchbytype/true`);
                const result = await response.json();
                if (result.success) {
                    setAllOrders(result.data);
                    setFilteredOrders(result.data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, []);

    const applyFilter = () => {
        const filtered = allOrders.filter((order) => {
            const orderDate = order.date.split("T")[0];
            const matchesDate = (!dateFrom || orderDate >= dateFrom) && (!dateTo || orderDate <= dateTo);
            const matchesOrderNo = !orderNoFilter || order.orderNo.toLowerCase().includes(orderNoFilter.toLowerCase());
            const matchesDscode = !dscodeFilter || order.dscode.toLowerCase().includes(dscodeFilter.toLowerCase());
            return matchesDate && matchesOrderNo && matchesDscode;
        });
        setFilteredOrders(filtered);
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Orders");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "PendingOrders.xlsx");
    };

    const openModal = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="max-w-7xl mx-auto lg:p-6 p-3 bg-white dark:bg-gray-700 shadow-lg rounded-lg text-gray-700 dark:text-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">Approved Order List</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium">Date From</label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Date To</label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Order No</label>
                    <input
                        type="text"
                        value={orderNoFilter}
                        onChange={(e) => setOrderNoFilter(e.target.value)}
                        className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                        placeholder="Filter by order number"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">DsCode</label>
                    <input
                        type="text"
                        value={dscodeFilter}
                        onChange={(e) => setDscodeFilter(e.target.value)}
                        className="border rounded-lg p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                        placeholder="Filter by dscode"
                    />
                </div>
                <button
                    onClick={applyFilter}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
                >
                    Show
                </button>
            </div>

            {/* Orders Table */}
            {loadingOrders ? (
                <div className="animate-pulse">
                    {Array(5).fill(0).map((_, index) => (
                        <div key={index} className="h-10 bg-gray-300 dark:bg-gray-600 my-2 rounded"></div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-600 text-sm md:text-base">
                                <th className="border border-gray-300 px-2 md:px-4 py-2">Order No</th>
                                <th className="border border-gray-300 px-2 md:px-4 py-2">DsId</th>
                                <th className="border border-gray-300 px-2 md:px-4 py-2">Mobile Number</th>
                                <th className="border border-gray-300 px-2 md:px-4 py-2">Amount</th>
                                <th className="border border-gray-300 px-2 md:px-4 py-2">Payment Mode</th>
                                <th className="border border-gray-300 px-2 md:px-4 py-2">Sp</th>
                                <th className="border border-gray-300 px-2 md:px-4 py-2">Date</th>
                                <th className="border border-gray-300 px-2 md:px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="text-center bg-white dark:bg-gray-800 text-sm md:text-base">
                                        <td className="border border-gray-300 px-2 md:px-4 py-2">{order.orderNo}</td>
                                        <td className="border border-gray-300 px-2 md:px-4 py-2">{order.dscode}</td>
                                        <td className="border border-gray-300 px-2 md:px-4 py-2">{order.mobileno}</td>
                                        <td className="border border-gray-300 px-2 md:px-4 py-2">{order.netamount}</td>
                                        <td className="border border-gray-300 px-2 md:px-4 py-2">{order.paymentmod}</td>
                                        <td className="border border-gray-300 px-2 md:px-4 py-2">{order.totalsp}</td>
                                        <td className="border border-gray-300 px-2 md:px-4 py-2">{new Date(order.date).toLocaleDateString("en-GB")}</td>
                                        <td className="border border-gray-300 px-2 md:px-4 py-2">
                                            <button onClick={() => openModal(order)} className="text-blue-500 hover:text-blue-700">View</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center p-4 text-gray-500">No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <button onClick={exportToExcel} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full md:w-40">Export to Excel</button>
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 w-full h-full p-6 overflow-auto relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-2xl"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-semibold mb-4">Order Details - {selectedOrder.orderNo}</h2>
                        <OrderDetails data={selectedOrder} />
                    </div>
                </div>
            )}
        </div>
    );
}
