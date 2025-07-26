"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PendingOrders() {
  const { dscode } = useParams();
  const [mainUser, setMainUser] = useState(null);
  const [relatedUsers, setRelatedUsers] = useState([]);
  const [groupCounts, setGroupCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dscode) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dscode/allbydscode/${dscode}`);
        const data = await res.json();
        if (data.success) {
          setMainUser(data.mainUser);
          const sortedUsers = data.relatedUsers.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setRelatedUsers(sortedUsers);

          // Count users per group
          const counts = {};
          for (const user of data.relatedUsers) {
            const group = user.group || "Unknown";
            counts[group] = (counts[group] || 0) + 1;
          }
          setGroupCounts(counts);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [dscode]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Main User (DS Code: {dscode})</h1>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading...</div>
      ) : (
        <>
          {mainUser && (
            <div className="mb-8 p-4 border rounded shadow bg-gray-50">
              <p className="mb-1"><strong>Name:</strong> {mainUser.name}</p>
              <p><strong>DS Code:</strong> {mainUser.dscode}</p>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-2">Related Users</h2>

          {/* Group Totals */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-2 text-gray-800">Group Totals</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              {Object.entries(groupCounts).map(([group, count]) => (
                <div key={group} className="bg-gray-100 px-3 py-1 rounded-md shadow-sm">
                  <strong>{group}:</strong> {count}
                </div>
              ))}
            </div>
          </div>


          {relatedUsers.length === 0 ? (
            <p className="text-gray-500">No related users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-200 rounded-md shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">#</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">PD Code</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">DS Code</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sao Sp</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sgo Sp</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Group</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Created Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Activate Date</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedUsers.map((user, index) => (
                    <tr key={user._id} className="even:bg-white odd:bg-gray-50 border-t">
                      <td className="px-4 py-2 text-sm">{index + 1}</td>
                      <td className="px-4 py-2 text-sm">{user.name}</td>
                      <td className="px-4 py-2 text-sm">{user.pdscode}</td>
                      <td className="px-4 py-2 text-sm">{user.dscode}</td>
                      <td className="px-4 py-2 text-sm">{user.saosp}</td>
                      <td className="px-4 py-2 text-sm">{user.sgosp}</td>
                      <td className="px-4 py-2 text-sm">{user.group}</td>
                      <td
                        className={`px-4 py-3 font-semibold ${user.usertype === "1" ? "text-green-600" : "text-red-600"}`}
                      >
                        {user.usertype === "1" ? "Active" : "Inactive"}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {user.activedate
                          ? new Date(user.activedate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
