"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import ProductModal from "./ProductModal ";

const ProductCard = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("/api/Product/Product/fetch/s");
        let fetchedProducts = response.data.data || [];

        // Sort products from newest to oldest
        fetchedProducts = fetchedProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProducts(fetchedProducts);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8)
            .fill("")
            .map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse p-4 rounded-xl shadow-lg">
                <div className="w-full h-52 bg-gray-300 rounded-md"></div>
                <div className="mt-4 h-4 w-3/4 bg-gray-400 rounded"></div>
                <div className="mt-2 h-4 w-1/2 bg-gray-400 rounded"></div>
                <div className="mt-2 h-4 w-1/3 bg-gray-400 rounded"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300 transition-transform duration-300 hover:shadow-2xl hover:-translate-y-2 p-4 cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="relative bg-gray-100 flex justify-center items-center rounded-t-xl">
              <Image
                src={product?.image || "/images/default.png"}
                width={300}
                height={300}
                className="w-full h-52 object-contain"
                alt={product?.productname}
              />
            </div>
            <div className="flex justify-between items-start p-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 truncate">{product?.productname}</h3>
                <p className="text-sm text-gray-500 line-through">MRP: ₹{product?.mrp}</p>
                <p className="text-lg font-bold text-green-600">Discount Price: ₹{product?.dp}</p>
              </div>
              <p className="text-md font-semibold text-gray-600">SP: ₹{product?.sp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default ProductCard;
