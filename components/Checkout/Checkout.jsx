'use client'; // if using Next.js App Router

import React, { useEffect, useState } from 'react';

export default function Checkout({ data }) {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const formattedDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).replace(/ /g, '/');
        setCurrentDate(formattedDate);
    }, []);

    return (
        <div className="lg:col-span-2">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
                <thead className='bg-[#4d98a1]'>
                    <tr>
                        <th colSpan={2} className="px-4 py-2 text-center text-2xl font-bold text-white">
                            Billing Address
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="bg-gray-50 dark:bg-gray-800">
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <td className="px-4 py-3">{currentDate}</td>
                    </tr>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="px-4 py-3 font-semibold">DS Code</th>
                        <td className="px-4 py-3">{data?.dscode}</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900">
                        <th className="px-4 py-3 font-semibold">DS Name</th>
                        <td className="px-4 py-3">{data?.name}</td>
                    </tr>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="px-4 py-3 font-semibold">Address</th>
                        <td className="px-4 py-3">{data?.address?.addressLine1}</td>
                    </tr>
                    <tr className="bg-gray-50 dark:bg-gray-900">
                        <th className="px-4 py-3 font-semibold">Mobile No.</th>
                        <td className="px-4 py-3">{data?.mobileNo}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
