'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Eye, AlertCircle, Trophy, Inbox, Users } from 'lucide-react';

export default function Page() {
    const [levelData, setLevelData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLevelData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/level/levelAchivers');
                if (response.data.success) {
                    // Assuming API returns data sorted by level, otherwise sort here
                    setLevelData(response.data.data);
                } else {
                    throw new Error("Failed to fetch level data.");
                }
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
                console.error("Error fetching level data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLevelData();
    }, []);

    const renderContent = () => {
        if (loading) {
            return <ListSkeleton />;
        }
        if (error) {
            return <ErrorMessage message={error} />;
        }
        if (levelData.length === 0) {
            return <NoDataMessage />;
        }
        return (
            <div className="space-y-3">
                {levelData.map((item, index) => (
                    <LevelListItem key={item.level} item={item} index={index} />
                ))}
            </div>
        );
    };

    return (
        <div className="">
            <div className="max-w-4xl mx-auto">
                <header className="mb-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                        Level Achievers Leaderboard
                    </h1>
                   
                </header>
                <main className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

// --- Child and Helper Components ---

const LevelListItem = ({ item, index }) => {
    const getRankStyles = (rank) => {
        switch (rank) {
            case 0: return 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-600'; // Gold
            case 1: return 'bg-gray-200 text-gray-700 border-2 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';    // Silver
            case 2: return 'bg-orange-100 text-orange-700 border-2 border-orange-300 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-600'; // Bronze
            default: return 'bg-gray-100 text-gray-600 border-2 border-transparent dark:bg-gray-900/50 dark:text-gray-400';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-3 sm:p-4 flex items-center gap-4 transition-colors duration-200">
            <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-lg ${getRankStyles(index)}`}>
                {index + 1}
            </div>
            <div className="flex-grow flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-400" />
                <h2 className="text-md sm:text-lg font-bold text-gray-800 dark:text-white">{item.level}</h2>
            </div>
            <div className="flex-shrink-0 flex items-center gap-4 sm:gap-6">
                <div className="text-right">
                    <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{item.userCount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Users</p>
                </div>
                <Link href={`/superadmin/Userprofile/levelachivers/${item.level}`}>
                    <span className='hidden sm:inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all'>
                        <Eye size={20} />
                    </span>
                     <span className='sm:hidden inline-flex items-center justify-center px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-600 rounded-full'>View</span>
                </Link>
            </div>
        </div>
    );
};

const ListSkeleton = () => (
     <div className="space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600"></div>
                <div className="flex-grow h-6 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
                <div className="flex-shrink-0 w-24 h-8 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
            </div>
        ))}
    </div>
);


const ErrorMessage = ({ message }) => (
    <div className="text-center py-12 px-6">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-medium text-red-600 dark:text-red-400">Loading Failed</h3>
        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">{message}</p>
    </div>
);

const NoDataMessage = () => (
    <div className="text-center py-12 px-6">
        <Inbox className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-white">No Data Found</h3>
        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">There are currently no level achievers to display.</p>
    </div>
);