"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Printer } from "lucide-react";
import { useSession } from "next-auth/react";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import QRCode from "react-qr-code";

// InfoRow component remains the same...
const InfoRow = ({ label, value, valueClass = "" }) => (
    <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${valueClass}`}>{value || "N/A"}</p>
    </div>
);


export default function Page() {
    const [data, setData] = useState(null);
    const [fetching, setFetching] = useState(true);
    const { data: session } = useSession();
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    // --- 1. DEFINE THE PRINT STYLES ---
    // This CSS tells the browser to set the printed page size to a standard ID card
    // and ensures background colors are printed correctly.
    const pageStyle = `
      @page {
        size: 85.6mm 54mm; /* Standard ID-1/CR80 card size */
        margin: 0;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact; /* Important for printing background colors */
        }
      }
    `;



    const issueDate = new Date().toLocaleDateString("en-GB");

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) {
                setFetching(false);
                return;
            }
            setFetching(true);
            try {
                const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
                if (response.data && response.data._id) {
                    setData(response.data);
                } else {
                    setData(null);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setData(null);
            } finally {
                setFetching(false);
            }
        };
        fetchUserData();
    }, [session?.user?.email]);

    const qrCodeValue = data ? `DS Code: ${data.dscode}\nName: ${data.name}` : "Vintage Life Wellness Pvt. Ltd.";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900/50 p-4 sm:p-8 flex flex-col items-center print:bg-white">
            <div className="w-full max-w-sm flex justify-start mb-6 print:hidden">
                <button
                    onClick={() => reactToPrintFn()}

                    disabled={fetching || !data}
                    className="flex items-center justify-center gap-2 w-40 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <Printer className="w-5 h-5" />
                    {fetching ? "Loading..." : "Print ID Card"}
                </button>
            </div>

            {fetching ? (
                <div className="w-[340px] h-[540px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center p-4">
                    <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading ID Card Data...</p>
                </div>
            ) : !data ? (
                <div className="w-[340px] h-[540px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center p-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Could Not Load Data</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">We were unable to retrieve the ID card details. Please try again later.</p>
                </div>
            ) : (
                <div ref={contentRef} className="w-[350px] md:w-[400px] rounded-2xl shadow-2xl">
                    {/* The ref is correctly placed on the container with all printable elements. */}
                    <div className="relative w-full h-full flex flex-col  overflow-hidden rounded-2xl">

                        {/* 1. The Header */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white text-center pt-5 pb-16">
                            <h1 className="text-xl font-bold uppercase tracking-widest">VINTAGE LIFE WELLNESS</h1>
                            <p className="text-[10px] font-light uppercase tracking-wider">PRIVATE LIMITED</p>
                            <p className="text-[9px] mt-1 opacity-70">CIN: U85100RJ2021PTC073007</p>
                        </div>

                        {/* 2. The Main Body with User Details */}
                        <div className="flex-grow bg-white p-5 pt-16">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <InfoRow label="Name" value={data.name} />
                                <InfoRow label="DS Code" value={data.dscode} />
                                <InfoRow label="Mobile No." value={data.mobileNo} />
                                <div className="col-span-2">
                                    <InfoRow
                                        label="Address"
                                        value={`${data.address.addressLine1 || ''}, ${data.address.addressLine2 || ''}, ${data.address.city || ''}, ${data.address.landmark || ''}, ${data.address.pinCode || ''}, ${data.address.state || ''}`}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <InfoRow label="Registered Office" value="F-1, A-13, Kanchan Deep, Panchwati Circle, Jaipur, Rajasthan, 302021" />
                                </div>
                                <InfoRow label="Date of Issue" value={issueDate} />
                                <InfoRow label="Date of Joining" value={data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-GB") : "N/A"} />
                            </div>
                        </div>

                        {/* 3. The Footer with QR Code */}
                        <div className="bg-gray-50 p-4 flex justify-between items-center mt-auto">
                            <div className="h-20 w-20 p-1 bg-white border">
                                <QRCode value={qrCodeValue} size={72} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
                            </div>
                            <div className="text-center">
                                <div className="w-32 h-8"></div>
                                <p className="border-t border-gray-400 text-xs font-semibold pt-1">Authorised Signatory</p>
                            </div>

                        </div>
                        <div className=" text-xs text-center bg-white border-t">Email : vintage@gmail.com</div>

                        {/* 4. The Profile Image */}
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full px-5">
                            <div className="mx-auto bg-white rounded-full p-1.5 shadow-lg w-28 h-28">
                                <Image
                                    width={100}
                                    height={100}
                                    src={data.image || "/images/user/icon-5359553_640.webp"}
                                    alt="User Profile"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}