// File: app/payment-history/page.jsx

'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

export default function PaymentHistoryPage() {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dsid, setDsid] = useState('')
  const [type, setType] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState({ totalAmount: 0, totalBonus: 0, totalPerformance: 0 });

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/PaymentHistory/get`, {
        params: { page, dsid, type, fromDate, toDate }
      })
      setData(res.data.data)
      setTotalPages(res.data.totalPages)
      setTotal(res.data.totals)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const types = [
    'order',
    'user active',
    'level update',
    'superadmin gift sp',
    'superadmin remove sp',
  ]

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>
      <div className="grid md:grid-cols-6 sm:grid-cols-2 gap-2 mb-4">
        <input
          type="text"
          placeholder="Search DSID"
          className="border p-2 rounded"
          value={dsid}
          onChange={(e) => setDsid(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}>
          <option value=''>All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      
        <input
          type="date"
          className="border p-2 rounded"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          onClick={fetchData}>
          Filter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">DSID</th>
              <th className="p-2 border">DSGroup</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Bonus Income</th>
              <th className="p-2 border">Performance Income</th>
              <th className="p-2 border">SP</th>
              <th className="p-2 border">Group</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Reference</th>
              <th className="p-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center p-4">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="text-center p-4">No data found</td></tr>
            ) : (
              data.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{item.dsid}</td>
                  <td className="p-2 border">{item.dsgroup}</td>
                  <td className="p-2 border">{item.amount || "-"}</td>
                  <td className="p-2 border">{item.bonus_income || "-"}</td>
                  <td className="p-2 border">{item.performance_income || "-"}</td>
                  <td className="p-2 border">{item.sp || "-"}</td>
                  <td className="p-2 border">{item.group || "-"}</td>
                  <td className="p-2 border">{item.type || "-"}</td>
                  <td className="p-2 border">{item.referencename || "-"}</td>
                  <td className="p-2 border">{dayjs(item.createdAt).format('YYYY-MM-DD')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50">
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50">
          Next
        </button>
      </div>
  
    </div>
  )
}
