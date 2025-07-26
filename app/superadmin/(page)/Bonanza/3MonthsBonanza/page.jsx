'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Custom CSS to style the datepicker for a modern look
const customDatepickerStyles = `
  .react-datepicker-wrapper .react-datepicker__input-container input {
    width: 100%;
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: #f9fafb;
    color: #111827;
    transition: all 0.2s ease-in-out;
  }
  .react-datepicker-wrapper .react-datepicker__input-container input:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    background-color: #ffffff;
  }
  .react-datepicker__header {
    background-color: #f97316;
    border-bottom: none;
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header {
    color: #ffffff;
    font-weight: 600;
  }
  .react-datepicker__day-name,
  .react-datepicker__day {
    color: #4b5563;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #ea580c;
    color: #ffffff;
  }
    .react-datepicker__day--in-selecting-range,
    .react-datepicker__day--in-range {
        background-color: #fb923c;
        color: #fff;
    }
  .react-datepicker__day:hover {
    background-color: #fed7aa;
    color: #9a3412;
  }
`;

// --- Sub-component for Advanced Date Display ---
const AdvancedDateDisplay = ({ data }) => {
  // 1. Date Calculation
  const today = new Date();
  const startDate = new Date(data.datefrom);
  const endDate = new Date(data.dateto);

  // Normalize dates to midnight for accurate day counting
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  const msInDay = 1000 * 60 * 60 * 24;

  // 2. Core Logic
  const totalDuration = Math.max(1, Math.round((endDate - startDate) / msInDay)); // Avoid division by zero
  let daysPassed = Math.round((today - startDate) / msInDay);
  let daysLeft = Math.round((endDate - today) / msInDay);
  
  let statusMessage = '';
  let progressPercentage = 0;

  if (daysLeft < 0) {
    // The event has ended
    statusMessage = `🏁 Ended ${-daysLeft} ${-daysLeft === 1 ? 'day' : 'days'} ago.`;
    progressPercentage = 100;
  } else if (daysPassed < 0) {
    // The event is in the future
    statusMessage = `⏳ Starts in ${-daysPassed} ${-daysPassed === 1 ? 'day' : 'days'}.`;
    progressPercentage = 0;
  } else {
    // The event is currently active
    daysPassed = Math.max(0, daysPassed); // Ensure it's not negative
    statusMessage = `⚡️ ${daysPassed} ${daysPassed === 1 ? 'day' : 'days'} passed, ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left.`;
    if (totalDuration > 0) {
      progressPercentage = Math.min(100, (daysPassed / totalDuration) * 100);
    }
  }

  return (
    <div className="mt-4">
        {/* --- Original Date Range --- */}
        <p className="text-gray-500 text-sm mt-1 mb-3">
            Active from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
        </p>

        {/* --- Dynamic Status Message --- */}
        <p className="text-sm font-semibold text-gray-700">{statusMessage}</p>
        
        {/* --- Visual Progress Bar --- */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
                className="bg-orange-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    </div>
  );
};


export default function ThreeMonthsBonanza() {
  const [data, setData] = useState(null);
  const [levels, setLevels] = useState([]);
  const [form, setForm] = useState({
    title: '',
    levelsData: [], // Array of { level: string, sao: string, sgo: string }
    datefrom: null,
    dateto: null,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch existing bonanza data
  const fetchData = async () => {
    try {
      const res = await fetch('/api/3months/fetch/all');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        const bonanzaData = json.data[0];
        setData({
          ...bonanzaData,
          datefrom: new Date(bonanzaData.datefrom),
          dateto: new Date(bonanzaData.dateto),
        });
      } else {
        setData(null);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  // Fetch levels from API
  const fetchLevels = async () => {
    try {
      const response = await axios.get('/api/level/fetch/level');
      const fetchedLevels = response.data.data || [];
      fetchedLevels.sort((a, b) => Number(a.sao) - Number(b.sao));
      setLevels(fetchedLevels);
      setForm((prev) => ({
        ...prev,
        levelsData: fetchedLevels.map((lvl) => ({
          level: lvl.level_name,
          sao: lvl.sao || '',
          sgo: lvl.sgo || '',
        })),
      }));
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLevels();
  }, []);

  // Handle change on title input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle date changes
  const handleDateChange = (field, date) => {
    setForm({ ...form, [field]: date });
  };

  // Handle change on dynamic levels' sao and sgo inputs
  const handleLevelChange = (index, field, value) => {
    const updatedLevels = [...form.levelsData];
    updatedLevels[index][field] = value;
    setForm({ ...form, levelsData: updatedLevels });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/3months/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          levels: form.levelsData,
          datefrom: form.datefrom,
          dateto: form.dateto,
        }),
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setForm({
          title: '',
          levelsData: levels.map((lvl) => ({
            level: lvl.level_name,
            sao: lvl.sao || '',
            sgo: lvl.sgo || '',
          })),
          datefrom: null,
          dateto: null,
        });
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle bonanza deletion
  const handleDelete = async () => {
    if (!data?._id) return;
    try {
      const res = await fetch(`/api/3months/delete/${data._id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        setData(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <>
      <style>{customDatepickerStyles}</style>
      <div className="">
        <div className="bgn p-6  shadow-lg mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Bonanza Management
            </h2>
            <p className="text-white/80 mt-1">Create or view the current 3-month bonanza.</p>
        </div>

        {initialLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-orange-600 rounded-full animate-ping"></div>
          </div>
        ) : data ? (
          <div className="bg-white p-6  shadow-md border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800">{data.title}</h3>
                    {/* --- INTEGRATED ADVANCED DATE DISPLAY --- */}
                    <AdvancedDateDisplay data={data} />
                </div>
                <button
                    onClick={handleDelete}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    Delete
                </button>
            </div>
            <div className="mt-6 border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-700 mb-4">Qualification Levels</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.levels.map((lvl, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                    <p className="font-semibold text-gray-800">{lvl.level}</p>
                    <p className="text-sm text-gray-600 mt-1">SAO: <span className="font-bold text-orange-600">{lvl.sao}</span> | SGO: <span className="font-bold text-orange-600">{lvl.sgo}</span></p>
                    </div>
                ))}
                </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-8  shadow-md border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Bonanza Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Quarterly Achievers Trip"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-shadow"
                  required
                />
              </div>

              <div className="space-y-6">
                <h4 className="font-semibold text-gray-700">Set Qualification Levels</h4>
                {levels.map((lvl, index) => (
                  <div key={lvl.level_name} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                    <h5 className="font-semibold text-gray-800 mb-3">{lvl.level_name}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="number"
                        value={form.levelsData[index]?.sao || ''}
                        onChange={(e) => handleLevelChange(index, 'sao', e.target.value)}
                        placeholder="Required SAO"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                        required
                      />
                      <input
                        type="number"
                        value={form.levelsData[index]?.sgo || ''}
                        onChange={(e) => handleLevelChange(index, 'sgo', e.target.value)}
                        placeholder="Required SGO"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <DatePicker
                    selected={form.datefrom}
                    onChange={(date) => handleDateChange('datefrom', date)}
                    selectsStart
                    startDate={form.datefrom}
                    endDate={form.dateto}
                    placeholderText="Select start date"
                    dateFormat="MMMM d, yyyy"
                    className="w-full" // Styling is applied via customDatepickerStyles
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <DatePicker
                    selected={form.dateto}
                    onChange={(date) => handleDateChange('dateto', date)}
                    selectsEnd
                    startDate={form.datefrom}
                    endDate={form.dateto}
                    minDate={form.datefrom}
                    placeholderText="Select end date"
                    dateFormat="MMMM d, yyyy"
                    className="w-full" // Styling is applied via customDatepickerStyles
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                type="submit"
                className="w-full bgn text-white text-base font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none"
                disabled={loading}
                >
                {loading ? 'Saving Bonanza...' : 'Create and Launch Bonanza'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
