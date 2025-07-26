'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

export default function Page() {
  const initialFormState = {
    level_name: '',
    sao: '',
    sgo: '',
    binary_income: '',
    bonus_income: '',
    performance_income: '',
    tour:'',
    bonus: '' // Allow empty value for bonus
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [errors, setErrors] = useState({}); // Store field-specific errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['sao', 'sgo', 'binary_income', 'bonus_income',].includes(name)
        ? Number(value) || ''
        : value,
    });

    // Clear errors when user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    try {
      const response = await axios.post('/api/level/create', formData);
      toast.success('Level added successfully!', { duration: 3000 });
      console.log('Level Added:', response.data);

      // Reset form fields after success
      setFormData(initialFormState);
    } catch (error) {
      toast.error('Failed to add level!', { duration: 3000 });

      if (error.response) {
        // If API returns validation errors
        setErrors(error.response.data.errors || {});
      } else {
        console.error('Error adding level:', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl mt-10 border border-gray-200">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-200">Add Level</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Level Name Field */}
        <div className="flex flex-col lg:col-span-2">
          <label className="text-gray-700 dark:text-gray-200  text-sm font-medium mb-1">Level Name</label>
          <input
            type="text"
            name="level_name"
            value={formData.level_name}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${errors.level_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
          />
          {errors.level_name && <p className="text-red-500 text-xs mt-1">{errors.level_name}</p>}
        </div>

        {/* Numeric Fields */}
        {['sao', 'sgo', 'binary_income', 'bonus_income'].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-200 text-sm font-medium mb-1 uppercase">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="number"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              // required
              disabled={isSubmitting}
              className={`w-full p-2 text-sm border rounded-md focus:outline-none focus:ring-2 ${errors[field] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
            />
            {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
          </div>
        ))}

        <div className="flex flex-col lg:col-span-2">
          <label className="text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">Performance income (Optional)</label>
          <input
            type="text"
            name="performance_income"
            value={formData.performance_income}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Bonus field (Optional) */}
        <div className="flex flex-col lg:col-span-2">
          <label className="text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">Bonus (Optional)</label>
          <input
            type="text"
            name="bonus"
            value={formData.bonus}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col lg:col-span-2">
          <label className="text-gray-700 dark:text-gray-200 text-sm font-medium mb-1">Tour (Optional)</label>
          <input
            type="text"
            name="tour"
            value={formData.tour}
            onChange={handleChange}
            disabled={isSubmitting}
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="lg:col-span-2 mx-auto">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-42  py-2 text-sm font-medium rounded-md transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
