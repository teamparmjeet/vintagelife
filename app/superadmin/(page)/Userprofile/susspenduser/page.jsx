"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Search, X, ChevronLeft, ChevronRight, Eye, Code, Calendar } from 'lucide-react';

const PAGE_LIMIT = 15;
const searchFields = [
    { value: 'dscode', label: 'DS Code' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'mobileNo', label: 'Mobile No.' },
    { value: 'acnumber', label: 'A/C Number' },
    { value: 'panno', label: 'PAN No.' },
    { value: 'aadharno', label: 'Aadhaar No.' },
];
// Main Page Component
export default function Page() {
    // State for data, loading, and errors
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for pagination and filters
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [dscode, setDscode] = useState("");

    const [searchField, setSearchField] = useState("dscode"); // Default search field
    const [searchValue, setSearchValue] = useState("");
    const [date, setDate] = useState("");

    // State to hold the filters that are actually applied
     const [appliedFilters, setAppliedFilters] = useState({
        searchField: "dscode",
        searchValue: "",
        date: "",
    });
    // Effect to fetch data when page or applied filters change
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            // Use the applied filters for the API call
            const params = {
                page,
                limit: PAGE_LIMIT,
                // Only send parameters if they have a value
                searchField: appliedFilters.searchValue ? appliedFilters.searchField : undefined,
                searchValue: appliedFilters.searchValue || undefined,
                date: appliedFilters.date || undefined,
            };

            try {
                const response = await axios.get("/api/user/fetchallsusspend/user", { params });
                // The backend already sorts, but client-side sort is fine as a fallback
                const sortedData = (response.data.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setData(sortedData);
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, appliedFilters]);

    // Handler to apply filters and trigger a search
    const handleSearch = () => {
        setPage(1); // Reset to first page on new search
        setAppliedFilters({ searchField, searchValue, date });
    };

    // Handler to clear filters and reset the search
    const handleClear = () => {
        setSearchField("dscode");
        setSearchValue("");
        setDate("");
        setPage(1);
        setAppliedFilters({ searchField: "dscode", searchValue: "", date: "" });
    };

    // Helper to render the main content area
    const renderContent = () => {
        if (loading) return <TableSkeletonLoader />;
        if (error) return <ErrorMessage message={error} />;
        if (data.length === 0) return <NoResultsMessage />;
        return <UserTable users={data} />;
    };

    return (
        <div className="">
            <div className="max-w-7xl mx-auto">
                <header className="mb-2 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">Susspend User Directory</h1>

                </header>

                {/* Filter and Search Controls */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        {/* NEW: Dropdown to select search type */}
                        <div>
                            <label htmlFor="search-field" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search By</label>
                            <select
                                id="search-field"
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                            >
                                {searchFields.map(field => (
                                    <option key={field.value} value={field.value}>{field.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* MODIFIED: Input for the search value */}
                        <FilterInput
                            label="Search Value"
                            type="text"
                            placeholder={`Enter ${searchFields.find(f => f.value === searchField)?.label}...`}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            icon={<Search className="w-5 h-5 text-gray-400" />}
                        />

                        {/* Date Filter (unchanged) */}
                        <FilterInput
                            label="Filter by Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            icon={<Calendar className="w-5 h-5 text-gray-400" />}
                        />

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bgn text-white px-4 py-2.5 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
                            >
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </button>
                            <button
                                onClick={handleClear}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300 disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                                <span>Clear</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                    {renderContent()}
                </div>

                {!loading && data.length > 0 && (
                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                )}
            </div>
        </div>
    );
}

// --- Sub-components (Memoized for performance) ---

const FilterInput = React.memo(({ label, icon, type, ...props }) => {
    // Programmatically open the picker on click for a better user experience
    const handleClick = (e) => {
        if (type === 'date' && e.target.showPicker) {
            try {
                e.target.showPicker();
            } catch (error) {
                console.error("Could not display picker:", error);
            }
        }
    };

    // Adjust padding for date inputs to avoid overlapping the native calendar icon
    const paddingClass = type === 'date' ? 'pr-2' : 'pr-4';

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
                <input
                    type={type}
                    {...props}
                    onClick={handleClick}
                    className={`w-full pl-10 ${paddingClass} py-2.5 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                />
            </div>
        </div>
    );
});

const UserTable = React.memo(({ users }) => (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
            <tr>
                <th scope="col" className="px-6 py-4">User</th>
                <th scope="col" className="px-6 py-4">Spo Code</th>
                <th scope="col" className="px-6 py-4 hidden sm:table-cell">Group</th>
                <th scope="col" className="px-6 py-4 hidden sm:table-cell">Mobile</th>
                <th scope="col" className="px-6 py-4 hidden md:table-cell">Level</th>
                <th scope="col" className="px-6 py-4 hidden lg:table-cell">Active Sp</th>
                <th scope="col" className="px-6 py-4 hidden lg:table-cell">Joining Date</th>
                <th scope="col" className="px-6 py-4 hidden lg:table-cell">Activation Date</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Password</th>
                <th scope="col" className="px-6 py-4 text-right">Action</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user) => (
                <tr key={user.dscode} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-bold">{user.name}</div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs truncate">{user.dscode}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">{user.pdscode}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">{user.group}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">{user.mobileNo}</td>
                    <td className="px-6 py-4 hidden md:table-cell">{user.level || 'N/A'}</td>
                    <td className="px-6 py-4 hidden lg:table-cell">{user.activesp}</td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                        {new Date(user.activedate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </td>

                    <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.usertype === "1"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}>
                            {user.usertype === "1" ? "Active" : "Inactive"}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <span>{user.plainpassword}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <Link href={`/superadmin/Userprofile/user/${user.email}`} className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                            <Eye size={14} />
                            <span>View</span>
                        </Link>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
));

const TableSkeletonLoader = () => (
    <div className="w-full p-4">
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-full mb-4"></div>
            {[...Array(10)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md w-full mb-2.5"></div>
            ))}
        </div>
    </div>
);

const ErrorMessage = React.memo(({ message }) => (
    <div className="text-center py-16">
        <X className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-lg font-medium text-red-600 dark:text-red-400">Oops! Something went wrong.</h3>
        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">{message}</p>
    </div>
));

const NoResultsMessage = React.memo(() => (
    <div className="text-center py-16">
        <Search className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-white">No Users Found</h3>
        <p className="mt-1 text-md text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
    </div>
));

const Pagination = React.memo(({ page, totalPages, setPage }) => (
    <div className="flex justify-center items-center mt-6 gap-2 sm:gap-4">
        <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
        </span>
        <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
        </button>
    </div>
));