"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toWords } from 'number-to-words';
import { useReactToPrint } from "react-to-print";


export default function OrderDetails({ data }) {
    const contentRef = useRef(null);
   const reactToPrintFn = useReactToPrint({ contentRef });

    const [orderStatus, setOrderStatus] = useState(data.status);
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryStatus, setDeliveryStatus] = useState(data.deliver);
    const [newDeliveryDate, setNewDeliveryDate] = useState(
        data.deliverdate ? new Date(data.deliverdate) : null
    );
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // --- Handlers for API calls (no changes needed here) ---
    const o = data._id;
    const handleStatusUpdate = async (newStatus) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/order/update/${o}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: data._id, status: newStatus }),
            });
            const result = await response.json();
            if (result.success) {
                setOrderStatus(newStatus);
              
                alert(`Order ${newStatus ? 'approved' : 'unapproved'} successfully!`);
                window.location.reload();
            } else {
                throw new Error(result.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdatecancle = async (newStatus) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/order/update/${o}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: data._id, status: newStatus }),
            });
            const result = await response.json();
            if (result.success) {
                setOrderStatus(newStatus);
                await fetch("/api/PaymentHistory/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        dsid: data.dscode,
                        amount: "0",
                        sp: -Math.abs(data.totalsp),
                        group: data.salegroup,
                        orderno: data.orderNo,
                        type: "order",
                    }),
                });
                alert(`Order cancelled successfully!`);
                window.location.reload();
            } else {
                throw new Error(result.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeliveryUpdate = async (newStatus) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/order/deliveryupdate/${data._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deliver: newStatus }),
            });
            const result = await response.json();
            if (result.success) {
                setDeliveryStatus(newStatus);
                alert(`Order marked as ${newStatus ? 'Delivered' : 'Not Delivered'} successfully!`);
            } else {
                throw new Error(result.message || 'Failed to update delivery status');
            }
        } catch (error) {
            console.error('Error updating delivery status:', error);
            alert('Failed to update delivery status. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeliveryDateUpdate = async () => {
        if (!newDeliveryDate) {
            return alert('Please select a valid date.');
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/order/update/${data._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deliverdate: new Date(newDeliveryDate) }),
            });
            const result = await response.json();
            if (result.success) {
                alert('Delivery date updated successfully!');
            } else {
                throw new Error(result.message || 'Failed to update delivery date');
            }
        } catch (error) {
            console.error('Error updating delivery date:', error);
            alert('Failed to update delivery date. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    // --- End of API handlers ---

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get("/api/Product/Product/fetch/s");
                setProducts(response.data.data || []);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getProductDetails = (productName) => {
        return products.find((p) => p.productname === productName);
    };

    const extractMainValue = (value) => {
        if (!value) return 0;
        const main = value.toString().split("(")[0];
        return Number(main) || 0;
    };

    // --- Corrected Calculation Logic ---
    const totals = {
        totalDP: 0,
        totalSP: 0,
        totalQty: 0,
        totalCGST: 0,
        totalSGST: 0,
        totalIGST: 0,
    };

    data.productDetails.forEach((product) => {
        const matchedProduct = getProductDetails(product.product);
        if (!matchedProduct) return;

        const quantity = Number(product.quantity) || 0;
        const dp = Number(matchedProduct.dp) || 0;
        const sp = Number(matchedProduct.sp) || 0;
        const cgst = extractMainValue(matchedProduct.cgst);
        const sgst = extractMainValue(matchedProduct.sgst);
        const igst = extractMainValue(matchedProduct.igst);

        totals.totalQty += quantity;
        totals.totalDP += dp * quantity;
        totals.totalSP += sp * quantity;

        // Correctly multiply tax by quantity
        totals.totalCGST += cgst * quantity;
        totals.totalSGST += sgst * quantity;
        totals.totalIGST += igst * quantity;
    });

    const totalTaxAmount = totals.totalCGST + totals.totalSGST + totals.totalIGST;
    const amountBeforeTax = totals.totalDP - totalTaxAmount;
    const shippingCharge = Number(data.shippingcharge) || 0;
    const netAmount = totals.totalDP + shippingCharge;
    const netAmountInWords = toWords(Math.round(netAmount));


    return (
        <>
            <button
                onClick={() => reactToPrintFn()}
                className="mt-4 ml-4 bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600"
            >
                Print Page
            </button>
            <div ref={contentRef} className="mx-auto m-8 p-4 border border-gray-400 rounded shadow text-sm bg-white">
                {/* Header */}
                <div className="text-center mb-2">
                    <h1 className="font-bold text-lg">VINTAGE LIFE WELLNESS PVT. LTD.</h1>
                    <p className="font-semibold">Address - Hore Chandra nagar.</p>
                    <p className="font-semibold">DTR P9 Noel School Gird Gwalior Fort Gwalior Pin code - 474008</p>
                    <p className="font-semibold mt-4">GSTIN : 1234567890</p>
                </div>

                {/* Invoice Info */}
                <div className="border border-gray-400 rounded-lg p-4 w-full mx-auto bg-white text-sm">
                    <div className="text-center font-bold text-base border-b border-gray-800 pb-2 mb-4">
                        Tax Invoice
                    </div>
                    <div className="grid grid-cols-2 gap-0">
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Invoice No.: </span>{data.orderNo}</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Transport Mode: </span></div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Invoice Date: </span>{new Date(data.date).toLocaleDateString('en-GB')}</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Vehicle Number: </span></div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Reverse Charges (Y/N): </span>NO</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Date Of Supply: </span></div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">State: </span>Rajasthan</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Place Of Supply: </span></div>
                    </div>
                </div>

                {/* Billing Section */}
                <div className="border border-t-0 border-gray-400 rounded-b-lg p-4 w-full mx-auto bg-white text-sm mt-1">
                    <div className="grid grid-cols-2 gap-0">
                        <div className="border border-gray-800 p-2 text-center font-semibold bg-gray-100">Bill To Party</div>
                        <div className="border border-gray-800 p-2 text-center font-semibold bg-gray-100">Ship To Party</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Name: </span>{data.dsname}</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Name: </span>{data.dsname}</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">DSID: </span>{data.dscode}</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Address: </span>{data.shippingAddress}, {data.shippinpPincode}</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Address: </span>{data.address}</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Pincode: </span>{data.shippinpPincode}</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Mobile No: </span>{data.mobileno}</div>
                        <div className="border border-gray-800 p-2"><span className="font-semibold">Mobile No: </span>{data.shippingmobile}</div>
                    </div>
                </div>

                {/* Product Table */}
                <div className="mt-5 overflow-x-auto">
                    <table className="w-full border border-black border-collapse mb-2">
                        <thead>
                            <tr>
                                <th className="border p-1">#</th>
                                <th className="border p-1">Product</th>
                                <th className="border p-1">HSN</th>
                                <th className="border p-1">Qty</th>
                                <th className="border p-1">DP</th>
                                <th className="border p-1">MRP</th>
                                <th className="border p-1">Amount</th>
                                <th className="border p-1">Taxable Amount</th>
                                <th className="border p-1">CGST <span className="text-xs block">Rate Amount</span></th>
                                <th className="border p-1">SGST <span className="text-xs block">Rate Amount</span></th>
                                <th className="border p-1">IGST <span className="text-xs block">Amount</span></th>
                                <th className="border p-1">Tax Rate</th>
                                <th className="border p-1">Total SP</th>
                                <th className="border p-1">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.productDetails.map((product, index) => {
                                const matched = getProductDetails(product.product);
                                if (!matched) return <tr key={index}><td colSpan="14" className="text-center p-1">Product details not found.</td></tr>;

                                const quantity = Number(product.quantity) || 0;
                                const dp = Number(matched.dp) || 0;
                                const totalAmount = dp * quantity;
                                const cgst = extractMainValue(matched.cgst);
                                const sgst = extractMainValue(matched.sgst);
                                const igst = extractMainValue(matched.igst);
                                const taxableValue = totalAmount - (cgst + sgst + igst) * quantity;

                                return (
                                    <tr key={index}>
                                        <td className="border p-1 text-center">{index + 1}</td>
                                        <td className="border p-1">{product.product}</td>
                                        <td className="border p-1">{matched.hsn || "-"}</td>
                                        <td className="border p-1">{quantity}</td>
                                        <td className="border p-1">{dp.toFixed(2)}</td>
                                        <td className="border p-1">{matched.mrp || "-"}</td>
                                        <td className="border p-1">{totalAmount.toFixed(2)}</td>
                                        <td className="border p-1">{taxableValue.toFixed(2)}</td>
                                        <td className="border p-1">{`${matched.cgst || "-"}`}</td>
                                        <td className="border p-1">{`${matched.sgst || "-"}`}</td>
                                        <td className="border p-1">  {(extractMainValue(matched.igst) ?? 0) * (quantity ?? 0) || "-"}</td>
                                        <td className="border p-1">{`${matched.igst || "-"}`} </td>
                                        <td className="border p-1">{(matched.sp * quantity).toFixed(2)}</td>
                                        <td className="border p-1">{totalAmount.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            <tr className="font-bold">
                                <td colSpan={3} className="border p-1 text-center">Total</td>
                                <td className="border p-1">{totals.totalQty}</td>
                                <td className="border p-1"></td>
                                <td className="border p-1"></td>
                                <td className="border p-1">{totals.totalDP.toFixed(2)}</td>
                                <td className="border p-1">{amountBeforeTax.toFixed(2)}</td>
                                <td className="border p-1">{totals.totalCGST.toFixed(2)}</td>
                                <td className="border p-1">{totals.totalSGST.toFixed(2)}</td>
                                <td className="border p-1">{totals.totalIGST.toFixed(2)}</td>
                                <td className="border p-1"></td>
                                <td className="border p-1">{totals.totalSP.toFixed(2)}</td>
                                <td className="border p-1">{totals.totalDP.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="border border-gray-400 w-full mx-auto bg-white text-sm mt-1">
                    <div className="lg:grid grid-cols-2">
                        <div className="border flex justify-center flex-col items-center p-4">
                            <p className="font-medium mb-4 underline">Total Invoice Amount in Words</p>
                            <p className="capitalize font-semibold text-lg text-center">{netAmountInWords} only</p>
                        </div>
                        <div className="grid grid-cols-2 gap-0">
                            <div className="border border-gray-800 p-2 font-semibold">Total Amount Before Tax</div>
                            <div className="border border-gray-800 p-2 font-semibold">₹ {amountBeforeTax.toFixed(2)}</div>

                            <div className="border border-gray-800 p-2 font-semibold">Add CGST</div>
                            <div className="border border-gray-800 p-2 font-semibold">₹ {totals.totalCGST.toFixed(2)}</div>

                            <div className="border border-gray-800 p-2 font-semibold">Add SGST</div>
                            <div className="border border-gray-800 p-2 font-semibold">₹ {totals.totalSGST.toFixed(2)}</div>

                            <div className="border border-gray-800 p-2 font-semibold">Add IGST</div>
                            <div className="border border-gray-800 p-2 font-semibold">₹ {totals.totalIGST.toFixed(2)}</div>

                            <div className="border border-gray-800 p-2 font-semibold">Total Tax Amount</div>
                            <div className="border border-gray-800 p-2 font-semibold">₹ {totalTaxAmount.toFixed(2)}</div>

                            <div className="border border-gray-800 p-2 font-semibold">Total Amount After Tax</div>
                            <div className="border border-gray-800 p-2 font-semibold">₹ {totals.totalDP.toFixed(2)}</div>

                            <div className="border border-gray-800 p-2 font-semibold">Shipping Charge</div>
                            <div className="border border-gray-800 p-2 font-semibold">₹ {shippingCharge.toFixed(2)}</div>

                            <div className="border border-gray-800 p-2 font-bold">Net Amount</div>
                            <div className="border border-gray-800 p-2 font-bold">₹ {netAmount.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border border-t-0 border-gray-400 w-full mx-auto bg-white text-sm mt-1">
                    <div className="lg:grid grid-cols-3">
                        <div className="border flex justify-end flex-col items-center">
                            <p className="font-medium mb-4">Common Seal</p>
                        </div>
                        <div className="col-span-2 text-center">
                            <div className="border border-gray-800 p-2 font-semibold">Certified that the particulars given above are true and correct</div>
                            <div className="border border-gray-800 p-2 font-semibold">VINTAGE LIFE WELLNESS PVT. LTD.</div>
                            {/* <div className="border border-gray-800 p-8 font-semibold"></div> */}
                            <div className="border border-gray-800 p-2 font-semibold">Authorized Signatory</div>
                        </div>
                    </div>
                </div>

                {loading && <p className="text-center text-blue-500 mt-4">Loading products...</p>}
                {error && <p className="text-center text-red-500 mt-4">{error}</p>}
            </div>

            {/* Action Buttons */}
            <div className="max-w-4xl mx-auto mt-6 p-4 bg-white border border-gray-300 rounded shadow-sm">
                {orderStatus && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date:</label>
                        <div className="flex items-center gap-2 flex-wrap">
                            <DatePicker
                                selected={newDeliveryDate}
                                onChange={(date) => setNewDeliveryDate(date)}
                                dateFormat="dd/MM/yyyy"
                                className="border border-gray-300 rounded px-2 py-1 text-sm w-40"
                                placeholderText="Select a date"
                            />
                            <button
                                onClick={handleDeliveryDateUpdate}
                                disabled={isLoading}
                                className="text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded transition"
                            >
                                {isLoading ? 'Updating...' : 'Update Date'}
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => handleStatusUpdate(true)}
                        disabled={orderStatus || isLoading}
                        className={`flex-1 py-2 px-4 rounded text-white font-semibold transition duration-200 ${orderStatus || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {isLoading && !orderStatus ? 'Approving...' : 'Approve'}
                    </button>
                    {orderStatus && (
                        <>
                            <button
                                onClick={() => handleDeliveryUpdate(true)}
                                disabled={deliveryStatus || isLoading}
                                className={`flex-1 py-2 px-4 rounded text-white font-semibold transition duration-200 ${deliveryStatus || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isLoading && !deliveryStatus ? 'Updating...' : 'Mark as Delivered'}
                            </button>
                            {!deliveryStatus && (
                                <button
                                    onClick={() => handleStatusUpdatecancle(false)}
                                    className="flex-1 py-2 px-4 rounded text-white font-semibold transition duration-200 bg-red-600 hover:bg-red-700"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}