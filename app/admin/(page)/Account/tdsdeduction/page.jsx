'use client'

import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { useSession } from 'next-auth/react'

export default function TDSReportPage() {
  const { data: session } = useSession()
  const [data, setData] = useState([])
  const [userds, setUserds] = useState('')
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

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/withdrawalreport/eachuserseccess/${userds}`)
      const result = await res.json()
      if (result.success) {
        setData(result.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userds) fetchData()
  }, [userds])

  const handleExport = () => {
    if (data.length === 0) return alert('No data to export.')

    const formatted = data.map(item => ({
      DSID: item.dsid,
      Name: item.name,
      'Payable Amount': item.payamount,
      'TDS (2%)': (item.charges * 0.4).toFixed(2),
      'Approve Date': item.statusapprovedate,
      UTR: item.utr,
    }))

    const worksheet = XLSX.utils.json_to_sheet(formatted)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TDS Report')
    XLSX.writeFile(workbook, 'TDS_Report.xlsx')
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-lg font-semibold underline">TDS Deduction Report</h1>

      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export to Excel
        </button>
      </div>

      <div className="overflow-auto border border-gray-300 shadow-md">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : data.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No data found</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">S. No.</th>
                <th className="p-3 border">DSID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Payable Amount</th>
                <th className="p-3 border">Admin Charge (3%)</th>
                <th className="p-3 border">TDS (2%)</th>
                <th className="p-3 border">Total</th>
                <th className="p-3 border">Approve Date</th>
                <th className="p-3 border">UTR</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{item.dsid}</td>
                  <td className="p-3 border">{item.name}</td>
                  <td className="p-3 border text-green-700 font-semibold">
                    ₹ {parseFloat(item.payamount).toLocaleString()}
                  </td>
                  <td className="p-3 border text-red-600 font-semibold">
                    ₹ {(item.charges * 0.6).toFixed(2)}
                  </td>
                   <td className="p-3 border text-red-600 font-semibold">
                    ₹ {(item.charges * 0.4).toFixed(2)}
                  </td>
                    <td className="p-3 border text-red-600 font-semibold">
                    ₹ {item.charges}
                  </td>
                  <td className="p-3 border">
                    {item.statusapprovedate
                      ? new Date(item.statusapprovedate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
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
