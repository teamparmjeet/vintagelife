'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Users, AlertCircle } from 'lucide-react';

// --- Skeleton Loader Component ---
const TableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-t-lg mb-1"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-12 bg-gray-200/50 dark:bg-gray-700/50 mb-1"></div>
    ))}
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-b-lg"></div>
  </div>
);

// --- Main Page Component ---
export default function Page() {
  const { data: session } = useSession();
  const [dscode, setDscode] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  // Effect to get the logged-in user's dscode
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) {
        // If there's no session after a brief wait, stop loading.
        setTimeout(() => {
            if (!session?.user?.email) {
                setLoading(false);
                setError("Could not retrieve user session. Please log in.");
            }
        }, 1500);
        return;
      }
      try {
        const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        if (response.data && response.data.dscode) {
          setDscode(response.data.dscode);
        } else {
          setError("User data not found or is incomplete.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Failed to fetch initial user data.");
        setLoading(false);
      }
    };
    fetchUserData();
  }, [session?.user?.email]);

  // Effect to search for the downline once dscode is available
  useEffect(() => {
    const handleSearch = async () => {
      if (!dscode) return;

      setLoading(true);
      setError(null);
      setSearchResult(null);

      try {
        const response = await axios.get(`/api/dscode/findtwobydscode/${dscode}`);
        if (response.data.success) {
          setSearchResult({
            user: response.data.mainUser,
            members: response.data.relatedUsers,
          });
        } else {
          setError("No user found with this D.S. ID.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [dscode]);

  const allUsers = searchResult?.user ? [searchResult.user, ...(searchResult.members || [])] : searchResult?.members || [];

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Downline Direct DS</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                A complete list of your direct downline members.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg px-4 py-2">
              <Users className="h-6 w-6" />
              <span className="text-lg font-semibold">
                Total: {loading ? '...' : allUsers.length}
              </span>
            </div>
          </div>

          {loading && <TableSkeleton />}

          {error && (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">An Error Occurred</h3>
              <p className="text-red-600 dark:text-red-400/80 mt-1">{error}</p>
            </div>
          )}

          {!loading && !error && searchResult && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full bg-white dark:bg-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    {[
                      "S.No", "DS Code", "DS Name", "DOJ", "Sponsor DS Code", 
                      "Self SP", "Total SP", "Status"
                    ].map((header) => (
                      <th key={header} scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {allUsers.map((user, index) => (
                    <tr key={user.dscode || index} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono textn ">{user?.dscode}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user?.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB") : "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">{user?.pdscode}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user?.selfSp || "-"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user?.totalSp || "-"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {user?.usertype === "0" ? (
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-red-600">
                            Pending
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bgn textw">
                            Approved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allUsers.length === 0 && (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                  No downline members found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
