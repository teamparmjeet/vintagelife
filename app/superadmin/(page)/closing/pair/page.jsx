'use client'

import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import axios from 'axios'
export default function Page() {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedIds, setSelectedIds] = useState([])

  const fetchData = async (page = 1) => {
    try {
      const res = await fetch(`/api/closing/getpairclosing?page=${page}&limit=10`)
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
    fetchData(currentPage)
  }, [currentPage])

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/newclosing/pair', { method: 'POST' })
      const result = await res.json()
      alert(result.message)
      fetchData(currentPage)
    } catch (error) {
      console.error('API call failed', error)
      alert('API call failed!')
    } finally {
      setLoading(false)
      setShowModal(false)
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }


  const handleExport = () => {
    const unpaid = data.filter(item => !item.status)
    if (unpaid.length === 0) return alert('No unpaid records to export.')

    const formatted = unpaid.map(item => ({
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Unpaid Closings')
    XLSX.writeFile(workbook, 'unpaid_closings.xlsx')
  }
  const handleSuccess = async (id, utr) => {
    if (!utr || utr.trim() === '') return alert('UTR is required for success');

    try {
      const res = await fetch('/api/closing/updatepair', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          updateData: {
            utr,
            status: true,
            statusapprovedate: new Date(),
          },
        }),
      });

      const result = await res.json();
      alert(result.message || 'Marked as Success');
      fetchData(currentPage);
    } catch (error) {
      console.error('Success update failed:', error);
      alert('Failed to mark as success.');
    }
  };


  const handleInvalid = async (id, reason) => {
    if (!reason || reason.trim() === '') return alert('Invalid reason is required');

    try {
      const res = await fetch('/api/closing/updatepair', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          updateData: {
            invalidresn: reason,
            invalidstatus: true, // optional: add status if needed
          },
        }),
      });

      const result = await res.json();
      alert(result.message || 'Marked as Invalid');
      fetchData(currentPage);
    } catch (error) {
      console.error('Invalid update failed:', error);
      alert('Failed to mark as invalid.');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>

          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Pair Closing
          </button>
        </div>
        <div className=' flex flex-wrap gap-2'>

          <button
            onClick={handleExport}
            className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-xl border border-gray-300 shadow-md">
        {data.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No data found</div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>

                <th className="p-3 border">DSID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">A/C No</th>
                <th className="p-3 border">IFSC</th>
                <th className="p-3 border">Bank</th>
                <th className="p-3 border">Amount</th>
                 <th className="p-3 border">Admin Charge (5%)</th>
                <th className="p-3 border">Pay Amount</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Approve/Invalid</th>
                {/* <th className="p-3 border">Status</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">

                  <td className="p-3 border">{item.dsid}</td>
                  <td className="p-3 border">{item.name}</td>
                  <td className="p-3 border">{item.acnumber || '-'}</td>
                  <td className="p-3 border">{item.ifscCode || '-'}</td>
                  <td className="p-3 border">{item.bankName || '-'}</td>
                  <td className="p-3 border">{item.amount}</td>
                  <td className="p-3 border">₹{item.charges}</td>

                  <td className="p-3 border">{item.payamount}</td>
                  <td className="p-3 border">{item.date}</td>
                  <td className="p-3 border space-y-1">
                    {/* Input for Success */}
                    <div className=' flex gap-2'>

                      <input
                        type="text"
                        placeholder="UTR"
                        value={item.successInput || ''}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[index].successInput = e.target.value;
                          setData(newData);
                        }}
                        className=" border rounded px-2 py-1 text-sm w-36"
                      />
                      <input
                        type="text"
                        placeholder="Invalid Reason"
                        value={item.invalidInput || ''}
                        onChange={(e) => {
                          const newData = [...data];
                          newData[index].invalidInput = e.target.value;
                          setData(newData);
                        }}
                        className=" border rounded px-2 py-1 text-sm w-36"
                      />
                    </div>
                    <div className=' flex gap-2'>
                      <button
                        onClick={() => handleSuccess(item._id, item.successInput)}
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs w-36"
                      >
                        Success
                      </button>

                      {/* Input for Invalid */}

                      <button
                        onClick={() => handleInvalid(item._id, item.invalidInput)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs w-36"
                      >
                        Invalid
                      </button>
                    </div>
                  </td>

                  {/* 
                  <td className="p-3 border text-center">
                    {item.status ? '✅' : '❌'}
                  </td> */}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Are you sure?</h2>
            <p className="text-gray-600 mb-6">This action cannot be undone. Do you want to continue?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >Cancel</button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-5 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >{loading ? 'Processing...' : 'Yes, Confirm'}</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}