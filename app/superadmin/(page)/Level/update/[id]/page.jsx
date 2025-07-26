'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

// Icon for the header
const LevelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 mr-3 text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
    />
  </svg>
);

// Custom Input Field Component
const InputField = ({ label, name, value, onChange, type = 'text', required = false, disabled = false, readOnly = false, error, placeholder, isOptional = false }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
      {label} {isOptional && <span className="text-xs text-gray-500">(Optional)</span>}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-700 border    focus:outline-none focus:ring-2 transition duration-200 ease-in-out ${
        error
          ? 'border-red-400 focus:ring-red-500/50'
          : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500/50 focus:border-indigo-500'
      } ${readOnly ? 'cursor-not-allowed bg-gray-200 dark:bg-gray-600' : ''}`}
    />
    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
  </div>
);


export default function EditLevelPage() {
  const { id } = useParams();
  const router = useRouter();

  const initialFormState = {
    level_name: '',
    sao: '',
    sgo: '',
    binary_income: '',
    bonus_income: '',
    performance_income: '',
    tour: '',
    bonus: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch level data by ID
  useEffect(() => {
    const fetchLevel = async () => {
      try {
        const response = await axios.get(`/api/level/findsinglebyid/${id}`);
        setFormData(response.data);
        toast.success('Level data loaded!');
      } catch (error) {
        toast.error('Failed to load level!');
        console.error('Error fetching level:', error);
      }
    };

    if (id) fetchLevel();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['sao', 'sgo', 'binary_income', 'bonus_income'].includes(name)
        ? Number(value) || ''
        : value,
    });

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const toastId = toast.loading('Updating level...');

    try {
      await axios.put(`/api/level/update/${id}`, formData);
      toast.success('Level updated successfully!', { id: toastId, duration: 4000 });
      setTimeout(() => router.push('/superadmin/Level/all'), 1000); // Redirect after a short delay
    } catch (error) {
      toast.error('Failed to update level!', { id: toastId, duration: 4000 });
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
      console.error('Error updating level:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-2xl  border border-gray-200 ">
        
        <div className="flex items-center justify-center mb-6">
          <LevelIcon />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Update Level
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="lg:col-span-2">
            <InputField
              label="Level Name"
              name="level_name"
              value={formData.level_name}
              onChange={handleChange}
              disabled={true}
              readOnly={true}
              error={errors.level_name}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="SAO"
              name="sao"
              type="number"
              value={formData.sao}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              error={errors.sao}
              placeholder="e.g., 100"
            />
            <InputField
              label="SGO"
              name="sgo"
              type="number"
              value={formData.sgo}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              error={errors.sgo}
              placeholder="e.g., 500"
            />
            <InputField
              label="Binary Income"
              name="binary_income"
              type="number"
              value={formData.binary_income}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              error={errors.binary_income}
              placeholder="e.g., 5000"
            />
            <InputField
              label="Bonus Income"
              name="bonus_income"
              type="number"
              value={formData.bonus_income}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              error={errors.bonus_income}
              placeholder="e.g., 1000"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Performance Income"
              name="performance_income"
              value={formData.performance_income}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Special Reward"
              isOptional={true}
            />
            <InputField
              label="Bonus"
              name="bonus"
              value={formData.bonus}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Yearly Bonus"
              isOptional={true}
            />
          </div>

          <div>
            <InputField
              label="Tour"
              name="tour"
              value={formData.tour}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., International Trip"
              isOptional={true}
            />
          </div>

          <div className="pt-4 flex items-center justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-8 py-3 text-base font-semibold text-white  shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bgn hbgb'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </div>
              ) : 'Update Level'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
