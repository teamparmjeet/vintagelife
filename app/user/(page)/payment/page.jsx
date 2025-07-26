'use client'

import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { useSession } from 'next-auth/react'

export default function Page() {
    const { data: session } = useSession()
    const [data, setData] = useState([])
    const [userds, setUserds] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedIds, setSelectedIds] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.user?.email) return
            try {
                const res = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`)
                setUserds(res.data?.dscode || '')
            } catch (err) {
                console.error('Failed to fetch user data:', err)
            }
        }
        fetchUserData()
    }, [session?.user?.email])

    const fetchData = async (page = 1) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/withdrawalreport/eachuserseccess/${userds}`)
            const result = await res.json()
            if (result.success) {
                setData(result.data)
                setTotalPages(result.totalPages || 1)
                setCurrentPage(result.currentPage || 1)
            }
        } catch (err) {
            console.error('Failed to fetch data', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userds) fetchData(currentPage)
    }, [currentPage, userds])

    const handleExport = () => {
        const records = selectedIds.length > 0
            ? data.filter(item => selectedIds.includes(item.dsid))
            : data

        if (records.length === 0) return alert('No records to export.')

        const formatted = records.map(item => ({
            DSID: item.dsid,
            Name: item.name,
            'A/C No': item.acnumber,
            IFSC: item.ifscCode,
            Bank: item.bankName,
            Amount: item.amount,
            'Admin Charge': (item.charges / 2).toFixed(2),
            'TDS': (item.charges / 3).toFixed(2),
            'Pay Amount': item.payamount,
            ApproveDate: item.statusapprovedate,
        }))

        const worksheet = XLSX.utils.json_to_sheet(formatted)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Withdrawals')
        XLSX.writeFile(workbook, 'WithdrawalReport.xlsx')
    }

    const handleSelectAll = (e) => {
        setSelectedIds(e.target.checked ? data.map(item => item.dsid) : [])
    }

    const toggleCheckbox = (dsid) => {
        setSelectedIds(prev =>
            prev.includes(dsid) ? prev.filter(id => id !== dsid) : [...prev, dsid]
        )
    }

    return (
        <div className="p-4 space-y-6">
            <h1 className="font-semibold underline">Success Withdrawal</h1>

            <div className="flex justify-end">
                <button
                    onClick={handleExport}
                    className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Export to Excel
                </button>
            </div>

            <div className="overflow-auto rounded-xl border border-gray-300 shadow-md">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading...</div>
                ) : data.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No data found</div>
                ) : (
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3 text-center border">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === data.length && data.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="p-3 border">DSID</th>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">A/C No</th>
                                <th className="p-3 border">IFSC</th>
                                <th className="p-3 border">Bank</th>
                                <th className="p-3 border">Amount</th>
                                <th className="p-3 border">Admin Charge (3%)</th>
                                <th className="p-3 border">TDS (2%)</th>
                                <th className="p-3 border">Pay Amount</th>
                                <th className="p-3 border">Approve Date</th>
                                <th className="p-3 border">UTR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-3 border text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(item.dsid)}
                                            onChange={() => toggleCheckbox(item.dsid)}
                                        />
                                    </td>
                                    <td className="p-3 border">{item.dsid}</td>
                                    <td className="p-3 border">{item.name}</td>
                                    <td className="p-3 border">{item.acnumber || '-'}</td>
                                    <td className="p-3 border">{item.ifscCode || '-'}</td>
                                    <td className="p-3 border">{item.bankName || '-'}</td>
                                    <td className="p-3 border">{parseFloat(item.amount).toLocaleString()}</td>
                                    <td className="p-3 border">₹{(item.charges * 0.6).toFixed(2)}</td> {/* TDS */}
                                    <td className="p-3 border">₹{(item.charges * 0.4).toFixed(2)}</td> {/* Admin Charge */}

                                    <td className="p-3 border">{item.payamount}</td>
                                    <td className="p-3 border">
                                        {item.statusapprovedate
                                            ? new Date(item.statusapprovedate).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                            })
                                            : '—'}
                                    </td>
                                    <td className="p-3 border text-center">{item.utr}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="flex justify-center items-center mt-4 gap-4">
                <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-sm font-semibold">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
