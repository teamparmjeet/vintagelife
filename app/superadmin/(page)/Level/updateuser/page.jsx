'use client'
import React, { useEffect, useState } from 'react'
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

export default function Page() {
    const [users, setUsers] = useState([])
    const [levels, setLevels] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [levelRes, userRes] = await Promise.all([
                    axios.get('/api/level/fetch/level'),
                    axios.get('/api/levelup/check/000001')
                ]);
                setLevels(levelRes.data.data || []);
                setUsers(userRes.data || []);
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const getNextEligibleLevel = (user) => {
        if (!levels.length || !user) return '-'

        const sortedLevels = [...levels].sort((a, b) => parseInt(a.sao) - parseInt(b.sao))

        let cumulativeSao = 0
        let cumulativeSgo = 0
        let userCurrentLevelIndex = -1

        const currentLevelName = user.level || user.LevelDetails?.slice(-1)[0]?.levelName

        sortedLevels.forEach((lvl, index) => {
            if (lvl.level_name === currentLevelName) {
                userCurrentLevelIndex = index
            }
        })

        const nextLevelIndex = userCurrentLevelIndex + 1

        for (let i = 0; i <= nextLevelIndex; i++) {
            cumulativeSao += parseInt(sortedLevels[i]?.sao || 0)
            cumulativeSgo += parseInt(sortedLevels[i]?.sgo || 0)
        }

        const nextLevel = sortedLevels[nextLevelIndex]

        if (
            nextLevel &&
            parseInt(user.totalSaoSP || 0) >= cumulativeSao &&
            parseInt(user.totalSgoSP || 0) >= cumulativeSgo
        ) {
            return nextLevel.level_name
        }

        return '-'
    }

    const handleBulkLevelUpgrade = async () => {
        try {
            const sortedLevels = [...levels].sort((a, b) => parseInt(a.sao) - parseInt(b.sao))
            const currentDate = new Date().toLocaleDateString("en-GB")

            for (const user of users) {
                if (!user || !user._id) continue

                const currentLevelName = user.level
                const userCurrentIndex = sortedLevels.findIndex((lvl) => lvl.level_name === currentLevelName)
                const nextIndex = userCurrentIndex + 1

                let cumulativeSao = 0
                let cumulativeSgo = 0

                for (let i = 0; i <= nextIndex; i++) {
                    cumulativeSao += parseInt(sortedLevels[i]?.sao || 0)
                    cumulativeSgo += parseInt(sortedLevels[i]?.sgo || 0)
                }

                const nextLevel = sortedLevels[nextIndex]
                if (
                    !nextLevel ||
                    parseInt(user.totalSaoSP || 0) < cumulativeSao ||
                    parseInt(user.totalSgoSP || 0) < cumulativeSgo
                ) {
                    continue
                }

                if (user?.LevelDetails?.some((lvl) => lvl.levelName === nextLevel.level_name)) {
                    continue
                }

                const updateData = {
                    id: user._id,
                    level: nextLevel.level_name,
                    LevelDetails: [...(user.LevelDetails || []), {
                        levelName: nextLevel.level_name,
                        sao: user.totalSaoSP.toString(),
                        sgo: user.totalSgoSP.toString()
                    }],
                    WalletDetails: [...(user.WalletDetails || []), {
                        salecommission: "",
                        salesgrowth: nextLevel.bonus_income?.toString() || "0",
                        date: currentDate,
                        performance: nextLevel.performance_income?.toString() || ""

                    }]
                }

                await axios.patch("/api/user/update/", updateData)

                await axios.post("/api/PaymentHistory/add", {
                    dsid: user.dscode,
                    group: user.group || "",
                    levelname: nextLevel.level_name,
                    type: "level update",
                    amount: "0",
                    // bonus_income: nextLevel.bonus_income?.toString() || "0",
                    sp: "0",
                    orderno: "",
                    referencename: "",

                    performance_income: nextLevel.performance_income?.toString() || "0"

                })
            }

            toast.success("All eligible users updated successfully!")
            window.location.reload()
        } catch (err) {
            console.error(err)
            toast.error("Bulk level update failed.")
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <Toaster />
            <h1 className="text-3xl font-bold mb-6 textn">User Level Advancement</h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-300">
                    {error}
                </div>
            )}
            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="text-center">
                        <div className="w-8 h-8 bordernormal rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-700">Loading, please wait...</p>
                    </div>
                </div>
            ) : (
                <>

                    <button
                        onClick={handleBulkLevelUpgrade}
                        className="mb-6 bgn hbgb text-white px-6 py-2 rounded shadow-md transition duration-200"
                    >
                        Bulk Level Upgrade
                    </button>

                    <div className="overflow-auto bg-white  shadow border border-gray-200">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                                <tr>
                                    <th className="px-4 py-3">DS Code</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Current Level</th>
                                    <th className="px-4 py-3 text-right">Total SAO RP</th>
                                    <th className="px-4 py-3 text-right">Total SGO RP</th>
                                    <th className="px-4 py-3">Next Eligible Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-t hover:bg-gray-50 transition duration-150"
                                    >
                                        <td className="px-4 py-3">{user.dscode}</td>
                                        <td className="px-4 py-3">{user.name}</td>
                                        <td className="px-4 py-3">{user.level || '-'}</td>
                                        <td className="px-4 py-3 text-right">{user.totalSaoSP}</td>
                                        <td className="px-4 py-3 text-right">{user.totalSgoSP}</td>
                                        <td className="px-4 py-3 font-semibold text-green-700">
                                            {getNextEligibleLevel(user)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}
