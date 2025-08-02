'use client'

import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

export default function Page() {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])
  const [dsidFilter, setDsidFilter] = useState('')

  const fetchData = async (page = 1, dscode = '') => {
    try {
      const res = await fetch(`/api/withdrawalreport/travel/pending?page=${page}&limit=10&dscode=${dscode}`)
      const result = await res.json()
      if (result.success) {
        setData(result.data)
        setTotalPages(result.totalPages)
        setCurrentPage(result.currentPage)
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
    }
  }

  useEffect(() => {
    fetchData(currentPage, dsidFilter)
  }, [currentPage, dsidFilter])

  const handleExport = () => {
    const recordsToExport = selectedIds.length > 0
      ? data.filter(item => selectedIds.includes(item.dsid))
      : data

    if (recordsToExport.length === 0) return alert('No records to export.')

    const formatted = recordsToExport.map(item => ({
      DSID: item.dsid,
      Name: item.name,
      'A/C No': item.acnumber,
      IFSC: item.ifscCode,
      Bank: item.bankName,
      Amount: item.amount,
      Charges: item.charges,
      'Pay Amount': item.payamount,
      Date: item.date
    }))

    const worksheet = XLSX.utils.json_to_sheet(formatted)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Selected Closings')
    XLSX.writeFile(workbook, 'Pending.xlsx')
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(data.map(item => item.dsid))
    } else {
      setSelectedIds([])
    }
  }

  const handleCheckboxChange = (dsid) => {
    setSelectedIds(prev =>
      prev.includes(dsid)
        ? prev.filter(id => id !== dsid)
        : [...prev, dsid]
    )
  }

  return (
    <div className="p-4 space-y-6">
        <h1 className=' font-semibold underline'>Pending Withdrawal</h1>
      <div className="flex flex-wrap justify-between gap-4">
        <input
          type="text"
          placeholder="Filter by DSID"
          className="px-3 py-2 border rounded w-full sm:w-auto"
          value={dsidFilter}
          onChange={(e) => {
            setCurrentPage(1)
            setDsidFilter(e.target.value)
          }}
        />

        <button
          onClick={handleExport}
          className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Export Selected / All to Excel
        </button>
      </div>

      <div className="overflow-auto rounded-xl border border-gray-300 shadow-md">
        {data.length === 0 ? (
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
                <th className="p-3 border">Pay Amount</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.dsid)}
                      onChange={() => handleCheckboxChange(item.dsid)}
                    />
                  </td>
                  <td className="p-3 border">{item.dsid}</td>
                  <td className="p-3 border">{item.name}</td>
                  <td className="p-3 border">{item.acnumber || '-'}</td>
                  <td className="p-3 border">{item.ifscCode || '-'}</td>
                  <td className="p-3 border">{item.bankName || '-'}</td>
                  <td className="p-3 border">{item.amount}</td>
                  <td className="p-3 border">{item.payamount}</td>
                  <td className="p-3 border">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm font-semibold">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
