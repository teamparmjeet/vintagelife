"use client";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";
import axios from "axios";
import OrderDetailsuser from "@/components/OrderDetailsuser/OrderDetailsuser";
export default function ApprovedOrders() {
  const { data: session } = useSession();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      try {
        const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        if (response.data?.name) {
          setData(response.data.dscode);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, [session?.user?.email]);

  useEffect(() => {
    if (!data) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const response = await fetch(`/api/order/userapproved/${data}`);
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
  }, [data]);

  const applyFilter = () => {
    const filtered = allOrders.filter((order) => {
      const orderDate = order.date.split("T")[0]; // Extract only the YYYY-MM-DD part
      return orderDate >= dateFrom && orderDate <= dateTo;
    });
    setFilteredOrders(filtered);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Orders");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "ApprovedOrders.xlsx");
  };
  const openModal = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="mx-auto lg:p-6 p-2 bg-white dark:bg-gray-700 shadow-lg  text-gray-700 dark:text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Approved Order List</h2>
      <div className="grid grid-cols-3 gap-4 mb-6 items-end">
        <div>
          <label className="block text-sm font-medium">Date From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="border  p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium">Date To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="border  p-2 w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white" />
        </div>
        <button onClick={applyFilter} className="bg-blue-500 text-white px-4 py-2  hover:bg-blue-600 w-full">Show</button>
      </div>

      {loadingOrders ? (
        <div className="animate-pulse">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="h-10 bg-gray-300 dark:bg-gray-600 my-2 "></div>
          ))}
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-300  overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-600">
              <th className="border border-gray-300 px-4 py-2">Order No</th>
              <th className="border border-gray-300 px-4 py-2">Mobile</th>
              <th className="border border-gray-300 px-4 py-2">Payment Mode</th>
              {/* <th className="border border-gray-300 px-4 py-2">Sale Group</th> */}
              <th className="border border-gray-300 px-4 py-2">Total Amount</th>
              <th className="border border-gray-300 px-4 py-2">Total RP</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="text-center bg-white dark:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2">{order.orderNo}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.mobileno}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.paymentmod}</td>
                  {/* <td className="border border-gray-300 px-4 py-2">{order.salegroup}</td> */}
                  <td className="border border-gray-300 px-4 py-2">{order.netamount}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.totalsp}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(order.date).toLocaleDateString("en-GB")}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.status ? "Approved" : "Pending"}</td>
                  <td className="border border-gray-300 px-2 md:px-4 py-2">
                    <button onClick={() => openModal(order)} className="text-blue-500 hover:text-blue-700">View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <button onClick={exportToExcel} className="mt-4 bg-green-500 text-white px-4 py-2  hover:bg-green-600 w-40">Export to Excel</button>
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
            <OrderDetailsuser data={selectedOrder} />
          </div>
        </div>
      )}
    </div>
  );
}
