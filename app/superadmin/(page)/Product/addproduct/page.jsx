"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from 'react-hot-toast';

// --- Helper Components ---

// Icon for the uploader
const UploadIcon = () => (
    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
    </svg>
);

// Tab component for navigation
const FormTab = ({ step, setStep, currentStep, title }) => (
    <button
        type="button"
        onClick={() => setStep(step)}
        className={`flex-1 py-3 px-2 text-sm font-medium text-center border-b-4 transition-colors duration-300
      ${currentStep === step
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
    >
        {title}
    </button>
);


export default function AddProductPage() {
    const [formData, setFormData] = useState({
        image: "", productname: "", group: "vintage", dp: "", sp: "", mrp: "",
        hsn: "", taxvalue: "", cgst: "", sgst: "", igst: ""
    });

    const [productGroups, setProductGroups] = useState([]);
    const [fetchingGroups, setFetchingGroups] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState(1);



    const handleChange = (e) => {
        // All GST fields are now independent
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        const imageData = new FormData();
        imageData.append("file", file);
        try {
            const response = await axios.post("/api/upload", imageData);
            setFormData({ ...formData, image: response.data.file.secure_url });
            toast.success("Image uploaded successfully!");
        } catch (error) {
            toast.error("Image upload failed. Please try again.");
            console.error("Image upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const isFormValid = () => {
        const { image, productname, group, dp, sp, mrp, hsn, taxvalue, igst } = formData;
        // CGST and SGST are optional, as per the original user code
        return image && productname && group && dp && sp && mrp && hsn && taxvalue && igst;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            toast.error("Please fill out all required fields.");
            return;
        }
        if (submitting) return;

        setSubmitting(true);
        try {
            const response = await axios.post("/api/Product/Product/create", formData);
            toast.success(response.data.message || "Product added successfully.");
            setFormData({
                image: "", productname: "", sp: "", mrp: "", group: "vintage", dp: "", hsn: "",
                taxvalue: "", cgst: "", sgst: "", igst: ""
            });
            setStep(1); // Reset to the first tab
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add product.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                            <input type="text" name="productname" placeholder="e.g., Wireless Mouse" value={formData.productname} onChange={handleChange} className="form-input" required />
                        </div>
                      
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Image</label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Uploaded Preview" className="w-full h-full object-contain rounded-lg p-2" />
                                    ) : uploading ? (
                                        <p>Uploading...</p>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <UploadIcon />
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, or WEBP</p>
                                        </div>
                                    )}
                                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Market Price (MRP)</label>
                            <input type="number" name="mrp" placeholder="0.00" value={formData.mrp} onChange={handleChange} className="form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">(SP)</label>
                            <input type="number" name="sp" placeholder="0.00" value={formData.sp} onChange={handleChange} className="form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount Price (DP)</label>
                            <input type="number" name="dp" placeholder="0.00" value={formData.dp} onChange={handleChange} className="form-input" required />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">HSN Code</label>
                            <input type="number" name="hsn" placeholder="e.g., 847160" value={formData.hsn} onChange={handleChange} className="form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tax Value (%)</label>
                            <input type="number" name="taxvalue" placeholder="e.g., 18" value={formData.taxvalue} onChange={handleChange} className="form-input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">IGST (%)</label>
                            <input type="number" name="igst" placeholder="Enter IGST percentage" value={formData.igst} onChange={handleChange} className="form-input" required />
                        </div>
                        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CGST (%)</label>
                                <input type="number" name="cgst" placeholder="Enter CGST percentage" value={formData.cgst} onChange={handleChange} className="form-input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SGST (%)</label>
                                <input type="number" name="sgst" placeholder="Enter SGST percentage" value={formData.sgst} onChange={handleChange} className="form-input" />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    <header className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">Add New Product</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Fill in the details below to add a new product to your inventory.</p>
                    </header>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex border-b border-gray-200 dark:border-gray-700">
                            <FormTab step={1} setStep={setStep} currentStep={step} title="1. Product Info" />
                            <FormTab step={2} setStep={setStep} currentStep={step} title="2. Pricing" />
                            <FormTab step={3} setStep={setStep} currentStep={step} title="3. Tax Details" />
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6 sm:p-8">
                                {renderStepContent()}
                            </div>

                            <div className="px-6 sm:px-8 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={!isFormValid() || submitting}
                                    className="px-8 py-3 bgn text-white font-semibold rounded-lg hbgb disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    {submitting ? "Submitting..." : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Simple CSS for custom form input class */}
            <style jsx global>{`
                .form-input {
                    width: 100%;
                    padding: 0.75rem;
                    background-color: #F9FAFB;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.5rem;
                    color: #111827;
                    transition: all 0.2s ease-in-out;
                }
                .dark .form-input {
                    background-color: #374151;
                    border-color: #4B5563;
                    color: #F9FAFB;
                }
                .form-input:focus {
                    outline: none;
                    ring-width: 2px;
                    ring-color: #6366F1;
                    border-color: #6366F1;
                }
                .dark .form-input:focus {
                    ring-color: #818CF8;
                    border-color: #818CF8;
                }
            `}</style>
        </>
    );
}