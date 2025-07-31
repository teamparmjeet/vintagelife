"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
export default function Page() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const [dsid, setDsid] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) return;
            try {
                const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
                if (response.data?.dscode) {
                    setDsid(response.data?.dscode);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setError("Unable to fetch user details.");
            }
        };
        fetchUserData();
    }, [session?.user?.email]);

    useEffect(() => {
        const fetchCart = async () => {
            if (!dsid) return;
            setLoading(true);
            setError("");
            try {
                const response = await axios.get(`/api/cart/userall/${dsid}`);
                setCart(response.data.data || []);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [dsid]);

    const totalSp = cart.reduce((sum, item) => sum + Number(item.totalsp || 0), 0);
    const totalAmount = cart.reduce((sum, item) => sum + Number(item.netamount || 0), 0);


    const handleQuantityChange = async (itemIndex, pdIndex, change) => {
        const currentItem = cart[itemIndex];
        const currentPd = currentItem.productDetails[pdIndex];
        const newQuantity = Number(currentPd.quantity) + Number(change);

        if (newQuantity < 1) return;

        const updatedPd = { ...currentPd, quantity: newQuantity };
        const updatedProductDetails = [...currentItem.productDetails];
        updatedProductDetails[pdIndex] = updatedPd;

        let updatedTotalSP = 0;
        let updatedNetAmount = 0;
        updatedProductDetails.forEach((p) => {
            updatedTotalSP += Number(p.sp) * Number(p.quantity);
            updatedNetAmount += Number(p.price) * Number(p.quantity);
        });

        const updatedCartItem = {
            productDetails: updatedProductDetails,
            totalsp: updatedTotalSP,
            netamount: updatedNetAmount,
        };

        try {
            await axios.patch(`/api/cart/update/${currentItem._id}`, updatedCartItem);
            const updatedCart = [...cart];
            updatedCart[itemIndex] = {
                ...updatedCart[itemIndex],
                ...updatedCartItem,
            };
            setCart(updatedCart);
        } catch (error) {
            console.error("Update failed", error);
            setError("Failed to update quantity.");
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            await axios.delete(`/api/cart/delete/${id}`);
            setCart((prev) => prev.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Delete failed", error);
            setError("Failed to remove item.");
        }
    };

    return (
        <div>
            <div className="flex justify-end">
                <Link
                    href="./CreateOrder"
                    className="bg-blue-700 px-3 py-1 rounded text-white hover:bg-blue-800 transition"
                >
                    Add Product
                </Link>
            </div>

            <div className=" mt-4 rounded-md ">
                <h2 className="text-lg font-semibold mb-3 dark:text-white text-gray-800">Cart</h2>

                {loading ? (
                    <div className="text-center text-blue-600 font-medium py-4">Loading cart...</div>
                ) : error ? (
                    <div className="text-red-600 py-4">{error}</div>
                ) : cart.length === 0 ? (
                    <p className="text-gray-600">No items in cart.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full  text-sm border border-gray-200">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-white">
                                    <th className="py-2 px-4 border text-left">Product</th>
                                    <th className="py-2 px-4 border text-center">Quantity</th>
                                    <th className="py-2 px-4 border text-center">Total RP</th>
                                    <th className="py-2 px-4 border text-center">Total Price</th>
                                    <th className="py-2 px-4 border text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, itemIndex) =>
                                    item.productDetails.map((pd, pdIndex) => (
                                        <tr key={`${itemIndex}-${pdIndex}`} className="border-t">
                                            <td className="py-2 px-4 border text-gray-500 dark:text-white">
                                                <span className="font-semibold text-gray-600 dark:text-white">{pd.product}</span>
                                                <br />
                                                Group <span className="text-gray-600 dark:text-white">: {pd.productgroup}</span>
                                                <br />
                                                Price <span className="text-gray-600 dark:text-white">: {pd.price}</span>
                                                <br />
                                                Rp <span className="text-gray-600 dark:text-white">: {pd.sp}</span>
                                            </td>
                                            <td className="py-2 px-4 border text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleQuantityChange(itemIndex, pdIndex, -1)}
                                                        className="bg-red-500 text-white px-2 rounded hover:bg-red-600"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 text-gray-800 dark:text-white">{pd.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(itemIndex, pdIndex, 1)}
                                                        className="bg-green-500 text-white px-2 rounded hover:bg-green-600"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 border text-center  text-gray-800 dark:text-white">{item.totalsp}</td>
                                            <td className="py-2 px-4 border text-center  text-gray-800 dark:text-white">{item.netamount}</td>
                                            <td className="py-2 px-4 border text-center">
                                                <button
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-center items-center w-full">
                            <div className="mt-10 w-full max-w-md bgn dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-2xl font-bold mb-6 text-center textw tracking-wide">
                                    🛒 Cart Summary
                                </h3>

                                <div className="flex justify-between items-center text-base mb-3 px-1">
                                    <span className="textw font-medium">Total Amount:</span>
                                    <span className="textw font-bold text-lg">
                                        ₹{totalAmount.toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-base mb-6 px-1">
                                    <span className="textw font-medium">Total RP:</span>
                                    <span className="textw font-bold text-lg">
                                        {totalSp.toFixed(2)}
                                    </span>
                                </div>

                                <Link
                                    href="./Checkout"
                                    className="w-full block text-center bgg textn text-white py-3 rounded-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 font-semibold tracking-wide"
                                >
                                    🚀 Proceed to Checkout
                                </Link>
                            </div>
                        </div>

                    </div>
                )}
            </div>
          
        </div>
    );
}
