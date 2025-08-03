'use client'

import React, { useState, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { useSession } from 'next-auth/react'
import DatePicker from 'react-datepicker'
import { parseISO, format, isAfter, isBefore, endOfDay, startOfDay } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'

export default function TDSReportPage() {
  const { data: session } = useSession()
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(false)
  const [filtering, setFiltering] = useState(false)
  const [error, setError] = useState(null)

  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)

  // Fetch Data
  const fetchData = useCallback(async () => {
    if (!session?.user?.dscode) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/withdrawalreport/eachuserseccess/${session.user.dscode}`)
      if (!res.ok) throw new Error('Failed to fetch report data')

      const result = await res.json()
      if (result.success) {
        setData(result.data || [])
        setFilteredData(result.data || [])
      } else {
        throw new Error(result.message || 'Data not found')
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [session?.user?.dscode])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Apply Filter
  const applyFilter = () => {
    if (!fromDate && !toDate) {
      setFilteredData(data)
      return
    }

    setFiltering(true)

    const filtered = data.filter(item => {
      const approveDate = item.statusapprovedate ? parseISO(item.statusapprovedate) : null
      if (!approveDate) return false

      const from = fromDate ? startOfDay(fromDate) : null
      const to = toDate ? endOfDay(toDate) : null

      if (from && isBefore(approveDate, from)) return false
      if (to && isAfter(approveDate, to)) return false

      return true
    })

    setTimeout(() => {
      setFilteredData(filtered)
      setFiltering(false)
    }, 300)
  }

  // Export to Excel
  const handleExport = () => {
    if (filteredData.length === 0) {
      alert('No data to export.')
      return
    }

    const formatted = filteredData.map(item => ({
      DSID: item.dsid,
      Name: item.name,
      'Payable Amount': item.payamount,
      'TDS (5%)': (item.charges * 1).toFixed(2),
      'Total Deducted': item.charges,
      'Approve Date': item.statusapprovedate
        ? format(parseISO(item.statusapprovedate), 'dd-MMM-yyyy')
        : '',
      UTR: item.utr,
    }))

    const worksheet = XLSX.utils.json_to_sheet(formatted)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TDS Report')

    const filename = `TDS_Report_${fromDate ? format(fromDate, 'yyyy-MM-dd') : 'start'}_to_${
      toDate ? format(toDate, 'yyyy-MM-dd') : 'end'
    }.xlsx`
    XLSX.writeFile(workbook, filename)
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-semibold underline">TDS Deduction Report</h1>

      {/* Date Filter */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-700 mb-1">From:</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="dd-MMM-yyyy"
            className="border px-3 py-2 rounded"
            placeholderText="Select start date"
            maxDate={new Date()}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">To:</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="dd-MMM-yyyy"
            className="border px-3 py-2 rounded"
            placeholderText="Select end date"
            maxDate={new Date()}
          />
        </div>
        <button
          onClick={applyFilter}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={filtering}
        >
          {filtering ? 'Filtering...' : 'Apply Filter'}
        </button>
        <button
          onClick={handleExport}
          className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export Filtered
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto border border-gray-300 shadow-md">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading data...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">{error}</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No data found</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">S. No.</th>
                <th className="p-3 border">DSID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Payable Amount</th>
                <th className="p-3 border">TDS (5%)</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Approve Date</th>
                <th className="p-3 border">UTR</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{item.dsid}</td>
                  <td className="p-3 border">{item.name}</td>
                  <td className="p-3 border text-green-700 font-semibold">
                    ₹ {parseFloat(item.payamount).toLocaleString()}
                  </td>
                  <td className="p-3 border text-red-600 font-semibold">
                    ₹ {(item.charges * 1).toFixed(2)}
                  </td>
                  <td className="p-3 border text-red-600 font-semibold">₹ {item.charges}</td>
                  <td className="p-3 border">
                    {item.statusapprovedate
                      ? format(parseISO(item.statusapprovedate), 'dd-MMM-yyyy')
                      : '—'}
                  </td>
                  <td className="p-3 border text-center">{item.utr || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
