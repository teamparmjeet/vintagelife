'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Extract the level param from pathname (or if it's a query param)
    // Suppose your page route is app/somepath/[id]/page.jsx, then you can use useParams (only in server component) or parse from URL.

    // If your route is e.g. /level/[id], easiest is parse from window.location.pathname
    const [levelId, setLevelId] = useState('');

    useEffect(() => {
        // This will only run client side
        // You can extract level from the URL path
        const pathSegments = window.location.pathname.split('/');
        const idFromUrl = decodeURIComponent(pathSegments[pathSegments.length - 1]);
        setLevelId(idFromUrl);
    }, []);

    const [levelData, setLevelData] = useState([]);

    useEffect(() => {
        if (!levelId) return;

        const fetchLevelData = async () => {
            try {
                const response = await axios.get(`/api/level/singlelevel/${levelId}`);
                if (response.data.success) {
                    setLevelData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching level data:", error);
            }
        };

        fetchLevelData();
    }, [levelId]);

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4 text-gray-800">🎖️ {levelId} Achiever Level List</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-800">
                        <tr>
                            <th className="px-6 py-3 border-b">Sr.</th>
                            <th className="px-6 py-3 border-b">Ds Code</th>
                            <th className="px-6 py-3 border-b">Name</th>
                            <th className="px-6 py-3 border-b">Group</th>
                            <th className="px-6 py-3 border-b">Mobile No</th>
                            <th className="px-6 py-3 border-b">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {levelData.length > 0 ? (
                            levelData.map((user, index) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-3 border-b">{index + 1}</td>
                                    <td className="px-6 py-3 border-b">{user.dscode}</td>
                                    <td className="px-6 py-3 border-b font-semibold">{user.name}</td>
                                    <td className="px-6 py-3 border-b font-semibold">{user.group}</td>
                                    <td className="px-6 py-3 border-b font-semibold">{user.mobileNo}</td>
                                    <td className="px-6 py-3 border-b">{user.email}</td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-gray-500">
                                    Loading or No Data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
