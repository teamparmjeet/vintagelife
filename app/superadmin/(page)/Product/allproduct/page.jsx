"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Toaster, toast } from 'react-hot-toast';

// --- Helper Component ---

// A skeleton row for a better table loading experience
const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="p-4"><div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
        <td className="p-4"><div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
        <td className="p-4"><div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
        <td className="p-4"><div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
        <td className="p-4"><div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
        <td className="p-4"><div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
        <td className="p-4"><div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded-full"></div></td>
        <td className="p-4"><div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div></td>
    </tr>
);


export default function Page() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [hsn, setHsn] = useState(""); // State for HSN code filter
    const [mindp, setMindp] = useState("");
    const [maxdp, setMaxdp] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api/Product/Product/fetch/s");
                setProducts(response.data.data || []);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const uniqueGroups = useMemo(() => [...new Set(products.map((p) => p.group))], [products]);

    const uniqueProducts = useMemo(() => [
        ...new Set(
            (selectedGroup ? products.filter((p) => p.group === selectedGroup) : products).map(
                (p) => p.productname
            )
        ),
    ], [products, selectedGroup]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchGroup = selectedGroup ? product.group === selectedGroup : true;
            const matchProduct = selectedProduct ? product.productname === selectedProduct : true;
            // Updated filtering logic to include HSN
            const matchHsn = hsn ? product.hsn.toString().includes(hsn) : true;
            const matchdp =
                (mindp ? product.dp >= parseFloat(mindp) : true) &&
                (maxdp ? product.dp <= parseFloat(maxdp) : true);
            return matchGroup && matchProduct && matchdp && matchHsn;
        });
    }, [selectedGroup, selectedProduct, mindp, maxdp, hsn, products]); // Added hsn to dependency array

    return (
        <>
            <Toaster position="top-right" />
            <div className="">
                <div className="max-w-7xl mx-auto">
                    <header className="text-center mb-4">
                        <h1 className="text-4xl sm:text-5xl font-extrabold textn pb-2">
                            Our Products
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Explore our collection. Use the filters below to find exactly what you're looking for.
                        </p>
                    </header>

                    {/* Sticky Filter Bar */}
                    <div className="sticky top-4 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                        {/* Adjusted grid for the new filter */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* <select value={selectedGroup} onChange={(e) => { setSelectedGroup(e.target.value); setSelectedProduct(""); }} className="form-input">
                                <option value="">All Groups</option>
                                {uniqueGroups.map((group) => <option key={group} value={group}>{group}</option>)}
                            </select> */}
                            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="form-input">
                                <option value="">All Products</option>
                                {uniqueProducts.map((product) => <option key={product} value={product}>{product}</option>)}
                            </select>
                            {/* HSN Code input field */}
                            <input type="text" placeholder="HSN Code" value={hsn} onChange={(e) => setHsn(e.target.value)} className="form-input" />
                            <input type="number" placeholder="Min Price (DP)" value={mindp} onChange={(e) => setMindp(e.target.value)} className="form-input" />
                            <input type="number" placeholder="Max Price (DP)" value={maxdp} onChange={(e) => setMaxdp(e.target.value)} className="form-input" />
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-left">
                            <thead className="border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Product</th>
                                    {/* <th scope="col" className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Group</th> */}
                                    <th scope="col" className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Discount Price</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">Market Price</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">HSN Code</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">CGST</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200">SGST</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                                ) : filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.productname}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white">{product.productname}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td className="px-6 py-4">
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                                                    {product.group}
                                                </span>
                                            </td> */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-baseline space-x-2">
                                                    <div className="font-extrabold textn">₹{product.dp}</div>
                                                </div>
                                            </td>
                                              <td className="px-6 py-4">
                                                <div className="flex items-baseline space-x-2">
                                                    <div className="text-sm text-gray-400 line-through">₹{product.mrp}</div>
                                                </div>
                                            </td>
                                             <td className="px-6 py-4">
                                                <div className="flex items-baseline space-x-2">
                                                    <div className="text-sm textn">{product.hsn}</div>
                                                </div>
                                            </td>
                                              <td className="px-6 py-4">
                                                <div className="flex items-baseline space-x-2">
                                                    <div className="text-sm textn">{product.cgst}</div>
                                                </div>
                                            </td>
                                              <td className="px-6 py-4">
                                                <div className="flex items-baseline space-x-2">
                                                    <div className="text-sm textn">{product.sgst}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link href={`/superadmin/Product/update/${product._id}`} className="px-4 py-2 bgn text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all">
                                                    Action
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        {/* Corrected colSpan to match the number of visible columns */}
                                        <td colSpan="7" className="text-center py-16 px-6">
                                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Products Found</h3>
                                            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Reusable CSS for form inputs */}
            <style jsx global>{`
                .form-input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background-color: #F9FAFB;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.5rem;
                    color: #111827;
                    transition: all 0.2s ease-in-out;
                    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
                }
                .dark .form-input {
                    background-color: #374151;
                    border-color: #4B5563;
                    color: #F9FAFB;
                }
                .form-input:focus {
                    outline: none;
                    --tw-ring-color: #6366F1;
                    box-shadow: 0 0 0 2px var(--tw-ring-color);
                    border-color: var(--tw-ring-color);
                }
            `}</style>
        </>
    );
}