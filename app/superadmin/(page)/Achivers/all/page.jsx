"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import { Toaster, toast } from 'react-hot-toast';

// A simple debounce hook to improve search performance
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


export default function Page() {
    const [achievers, setAchievers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    useEffect(() => {
        const fetchAchievers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/achivers/fetch/s");
                setAchievers(response.data.data || []);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch achievers.");
            } finally {
                setLoading(false);
            }
        };
        fetchAchievers();
    }, []);

    const deleteAchiever = async (id) => {
        const originalAchievers = [...achievers];
        setAchievers(prev => prev.filter(a => a._id !== id));
        try {
            await axios.delete(`/api/achivers/delete/${id}`);
            toast.success("Achiever removed.");
        } catch (error) {
            setAchievers(originalAchievers);
            toast.error("Failed to remove achiever.");
        }
    };

    const uniqueTypes = useMemo(() => [...new Set(achievers.map(a => a.achivementtype1))], [achievers]);

    const filteredAchievers = useMemo(() => {
        return achievers.filter(achiever => {
            const matchesType = selectedType ? achiever.achivementtype1 === selectedType : true;
            const matchesSearch = debouncedSearchTerm ?
                achiever.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                (achiever.address && achiever.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) :
                true;
            return matchesType && matchesSearch;
        });
    }, [selectedType, debouncedSearchTerm, achievers]);


    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="">
                <div className=" mx-auto">
                    <header className="text-center mb-2">
                        <h1 className="text-4xl font-extrabold text-transparent textn pb-2">
                            Hall of Achievers
                        </h1>
                       
                    </header>

                    {/* --- Controls: Filter and Search --- */}
                    <div className="sticky top-4 z-10 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm p-4  shadow-md border border-gray-200 dark:border-gray-700 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Search by name or address..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            />
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            >
                                <option value="">All Achievement Types</option>
                                {uniqueTypes.map((type, index) => <option key={index} value={type}>{type}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* --- Content Area --- */}
                    {loading ? (
                        <div className="flex justify-center p-16">
                             <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
                        </div>
                    ) : (
                        <div>
                            {filteredAchievers.length > 0 ? (
                                <div className="overflow-x-auto bg-white dark:bg-gray-800  shadow-md border border-gray-200 dark:border-gray-700">
                                    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
                                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th scope="col" className="p-4">Image</th>
                                                <th scope="col" className="p-4">Name</th>
                                                <th scope="col" className="p-4">Address</th>
                                                <th scope="col" className="p-4">Achievement</th>
                                                <th scope="col" className="p-4">Details</th>
                                                <th scope="col" className="p-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAchievers.map((achiever) => (
                                                <tr key={achiever._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
                                                    <td className="p-2">
                                                        <Image src={achiever.image} alt={achiever.name} width={40} height={40} className="rounded-full object-cover"/>
                                                    </td>
                                                    <td className="p-4 font-bold text-gray-900 dark:text-white">{achiever.name}</td>
                                                    <td className="p-4">{achiever.address}</td>
                                                    <td className="p-4">
                                                        <span className="inline-block px-2 py-1 rounded-full font-semibold text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                                            {achiever.achivementtype1}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {(achiever?.ranktype || achiever?.triptype) && (
                                                            <span className="inline-block px-2 py-1 rounded-full font-semibold text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                                {achiever?.ranktype || achiever?.triptype}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={() => deleteAchiever(achiever._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-white dark:bg-gray-800  shadow-md">
                                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Achievers Found</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}