"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
export default function Page() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [mindp, setMindp] = useState("");
  const [maxdp, setMaxdp] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("/api/Product/Product/fetch/s");
        setProducts(response.data.data || []);
        setFilteredProducts(response.data.data || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get unique groups
  const uniqueGroups = [...new Set(products.map((p) => p.group))];

  // Get unique products (if group selected, filter; otherwise, show all)
  const uniqueProducts = [
    ...new Set(
      (selectedGroup ? products.filter((p) => p.group === selectedGroup) : products).map(
        (p) => p.productname
      )
    ),
  ];

  // Filter Logic
  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchGroup = selectedGroup ? product.group === selectedGroup : true;
      const matchProduct = selectedProduct
        ? product.productname === selectedProduct
        : true;
      const matchdp =
        (mindp ? product.dp >= parseFloat(mindp) : true) &&
        (maxdp ? product.dp <= parseFloat(maxdp) : true);

      return matchGroup && matchProduct && matchdp;
    });

    setFilteredProducts(filtered);
  }, [selectedGroup, selectedProduct, mindp, maxdp, products]);

  return (
    <div className="mx-auto lg:p-8 p-3 bg-white dark:bg-gray-900 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-8">
        🛍️ Product List
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Group Filter */}
        <select
          className="p-3 border rounded-lg shadow-sm w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition"
          value={selectedGroup}
          onChange={(e) => {
            setSelectedGroup(e.target.value);
            setSelectedProduct(""); // Reset product filter when group changes
          }}
        >
          <option value="" className="text-gray-700 dark:text-gray-300">All Groups</option>
          {uniqueGroups.map((group) => (
            <option key={group} value={group} className="text-gray-700 dark:text-gray-300">
              {group}
            </option>
          ))}
        </select>

        {/* Product Filter */}
        <select
          className="p-3 border rounded-lg shadow-sm w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="" className="text-gray-700 dark:text-gray-300">All Products</option>
          {uniqueProducts.map((product) => (
            <option key={product} value={product} className="text-gray-700 dark:text-gray-300">
              {product}
            </option>
          ))}
        </select>

        {/* Min dp Filter */}
        <input
          type="number"
          className="p-3 border rounded-lg shadow-sm w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition"
          placeholder="Min dp"
          value={mindp}
          onChange={(e) => setMindp(e.target.value)}
        />

        {/* Max dp Filter */}
        <input
          type="number"
          className="p-3 border rounded-lg shadow-sm w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition"
          placeholder="Max dp"
          value={maxdp}
          onChange={(e) => setMaxdp(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {loading && <p className="text-blue-500 dark:text-blue-400 text-center">Loading products...</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center">No products available.</p>
      )}

      {/* Product Table */}
      {filteredProducts.length > 0 && (
        <div className="overflow-x-auto mt-6 border border-gray-100 dark:border-gray-600 rounded-lg">
          <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white dark:bg-indigo-700">
              <tr>
                <th className="py-4 px-6 text-sm text-left">Sn</th>
                <th className="py-4 px-6 text-sm text-left">Image</th>
                <th className="py-4 px-6 text-sm text-left">Product Name</th>
                <th className="py-4 px-6 text-sm text-left">Group</th>
                <th className="py-4 px-6 text-sm text-left">RP</th>
                <th className="py-4 px-6 text-sm text-left">Mrp</th>
                <th className="py-4 px-6 text-sm text-left">Discount Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className={`border-b dark:border-gray-700 ${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"
                    } hover:bg-indigo-100 dark:hover:bg-indigo-900 transition`}
                >
                  <td className="py-4 px-6 text-gray-800 dark:text-gray-200">{index + 1}</td>
                  <td className="py-4 px-6 text-gray-800 dark:text-gray-200">
                    <Link href={product.image} target="_blank">
                      <Image
                        src={product.image}
                        alt=""
                        priority
                        width={50}
                        height={50}
                      />
                    </Link>
                  </td>
                  <td className="py-4 text-sm px-6 text-gray-800 dark:text-gray-200">{product.productname}</td>
                  <td className="py-4 text-sm px-6 text-gray-800 dark:text-gray-200">{product.group}</td>
                  <td className="py-4 text-sm px-6 text-gray-800 dark:text-gray-200">{product.sp}</td>
                  <td className="py-4 text-sm px-6 text-gray-800 dark:text-gray-200">{product.mrp}</td>
                  <td className="py-4 text-sm px-6 font-semibold text-indigo-700 dark:text-indigo-400">
                    ₹{product.dp}
                  </td>
                 

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
}
