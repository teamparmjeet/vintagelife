"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Checkout from "@/components/Checkout/Checkout";
import { InputField, SelectField } from "@/components/forminput/Input";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signOut } from 'next-auth/react';

export default function Page() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [sameAsBilling, setSameAsBilling] = useState(false);
    const { data: session } = useSession();
    const [dsid, setDsid] = useState("");
    const [userdata, setUserdata] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        transactionId: "",
        dscode: "",
        dsname: "",
        address: "",
        mobileno: "",
        shippingAddress: "",
        shippingmobile: "",
        shippinpPincode: "",
        paymentmod: "",
        salegroup: "",
        productDetails: [{ productgroup: "", product: "", quantity: "" }],
        shippingcharge: "",
        netamount: "",
        remarks: "",
        totalsp: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) return;
            try {
                const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
                if (response.data?.dscode) {
                    setDsid(response.data?.dscode);
                    setUserdata(response.data);
                    if (response.data.defaultdata !== "user") {
                        console.log("Logging out because userstatus is:", response.data.defaultdata);
                        await signOut({ callbackUrl: "/" });
                    } else {
                        console.log("User is logged in with defaultdata: user");
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setError("Unable to fetch user details.");
            }
        };
        fetchUserData();
    }, [session?.user?.email]);

    useEffect(() => {
        if (userdata) {
            setFormData(prev => ({
                ...prev,
                mobileno: userdata?.mobileNo || "",
                dsname: userdata?.name || "",
                address: userdata?.address?.addressLine1 || "",
            }));
        }
    }, [userdata]);

    useEffect(() => {
        const fetchCart = async () => {
            if (!dsid) return;
            setLoading(true);
            setError("");
            try {
                const response = await axios.get(`/api/cart/userall/${dsid}`);
                const cartData = response.data.data || [];
                setCart(cartData);

                const allProductDetails = cartData.flatMap(entry => entry.productDetails || []);
                const totalNetAmount = cartData.reduce((sum, entry) => sum + parseFloat(entry.netamount || "0"), 0);
                const totalSp = cartData.reduce((sum, entry) => sum + parseFloat(entry.totalsp || "0"), 0);
                const shippingCharge = totalNetAmount > 2000 ? 0 : 70;

                setFormData(prev => ({
                    ...prev,
                    dscode: dsid,
                    productDetails: allProductDetails,
                    netamount: totalNetAmount + shippingCharge,
                    totalsp: totalSp,
                    shippingcharge: shippingCharge,
                }));
            } catch (error) {
                setError(error.response?.data?.message || "Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [dsid]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleCheckboxChange = () => {
        setSameAsBilling(prev => {
            const newVal = !prev;
            if (newVal) {
                setFormData(prev => ({
                    ...prev,
                    shippingAddress: prev.address,
                    shippingmobile: prev.mobileno,
                    shippingPincode: userdata?.address?.pinCode || ""
                }));
            } else {
                // Clear shipping fields
                setFormData(prev => ({
                    ...prev,
                    shippingAddress: '',
                    shippingmobile: '',
                    shippingPincode: ''
                }));
            }
            return newVal;
        });
    };



    const handleSubmit = async () => {
        setFormError("");
        setSubmitting(true);
        const requiredFields = [
            "date", "dscode", "dsname", "address", "mobileno",
            "shippingAddress", "shippingmobile", "shippinpPincode",
            "paymentmod", "salegroup", "netamount", "totalsp"
        ];

        for (let field of requiredFields) {
            if (!formData[field]) {
                setFormError(`Please fill the required field: ${field}`);
                 setSubmitting(false);
                return;
            }
        }
        if (userdata?.defaultdata?.toLowerCase() !== "user") {
            toast.error(`Your account is ${userdata.defaultdata.toUpperCase()}, logging out...`);
            console.warn("Logging out because userstatus is:", userdata.defaultdata);
            setTimeout(async () => {
                await signOut({ callbackUrl: "/" });
            }, 1500);
            return;
        }

        if (formData.paymentmod === "Online" && !formData.transactionId) {
            setFormError("Transaction ID is required for Online payments.");
            return;
        }

        try {
            const response = await axios.post("/api/order/create", formData);
            if (response.data.success) {
                toast.success(response.data.message);

                // ✅ Delete cart items by dscode
                try {
                    const deleteResponse = await axios.delete(`/api/cart/deleteByDscode?dscode=${formData.dscode}`);
                    if (deleteResponse.data.success) {
                        console.log("Cart items deleted:", deleteResponse.data.message);
                    } else {
                        console.warn("Failed to delete cart items");
                    }
                } catch (deleteError) {
                    console.error("Error deleting cart items by dscode:", deleteError);
                }

                router.push("./CreateOrder")
            }
        } catch (err) {
            console.error(err);
            setFormError("Something went wrong while submitting the form.");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className=" space-y-4">
            <div className="grid lg:grid-cols-5 gap-4">
                <Checkout data={userdata} /> <Toaster />
                <div className="lg:col-span-3">
                    <table className="w-full text-sm text-left text-gray-700 border border-gray-300 rounded-lg shadow-md mt-6">
                        <thead>
                            <tr className="bg-gray-200">
                                <th colSpan={2} className="px-4 py-4 text-center text-2xl font-bold text-gray-800">
                                    Shipping Address
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td colSpan={2} className="px-4 py-2">
                                    <label className="inline-flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={sameAsBilling}
                                            onChange={handleCheckboxChange}
                                            className="form-checkbox"
                                        />
                                        <span>Same as billing address</span>
                                    </label>
                                </td>
                            </tr>
                            <InputField label="Date" name="date" type="date" defaultValue={formData.date} disabled />
                            <SelectField
                                label="Medium of Payment"
                                name="paymentmod"
                                options={["Cash","Online"]}
                                value={formData.paymentmod}
                                onChange={handleChange}
                            />
                            {formData.paymentmod === "Online" && (
                                <InputField label="Transaction ID" name="transactionId" placeholder="Enter Transaction ID" onChange={handleChange} required />
                            )}
                            <InputField label="DS Code" name="dscode" defaultValue={formData.dscode} disabled required />
                            <InputField label="DS Name" name="dsname" defaultValue={formData.dsname} disabled required />
                            <InputField label="Address" name="address" defaultValue={formData.address} disabled required />
                            <InputField label="Mobile" name="mobileno" defaultValue={formData.mobileno} disabled required />
                            <InputField label="Shipping Address" name="shippingAddress" defaultValue={formData.shippingAddress} onChange={handleChange} required />
                            <InputField label="Shipping Mobile" name="shippingmobile" type="tel" defaultValue={formData.shippingmobile} onChange={handleChange} required />
                            <InputField label="Shipping Pincode" name="shippinpPincode" defaultValue={formData.shippinpPincode} onChange={handleChange} required />
                            <InputField label="Net Amount" name="netamount" defaultValue={formData.netamount} disabled />
                            <InputField label="Total RP" name="totalsp" defaultValue={formData.totalsp} disabled />
                            <InputField label="Shipping Charge" name="shippingcharge" defaultValue={formData.shippingcharge} disabled />
                            <SelectField label="Sale Group" name="salegroup" options={["SAO", "SGO"]} value={formData.salegroup} onChange={handleChange} required />
                        </tbody>
                    </table>

                    {formError && <p className="text-red-600 mt-2">{formError}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`mt-4 px-6 py-2 rounded transition-all ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bgn hover:bg-blue-700 text-white'
                            }`}
                    >
                        {submitting ? "Submitting..." : "Submit Order"}
                    </button>

                </div>
            </div>
        </div>
    );
}
