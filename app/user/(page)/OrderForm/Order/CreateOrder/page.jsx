"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { ShoppingCart, FilePlus } from 'lucide-react';
import Link from "next/link";
export default function Page() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [productGroups, setProductGroups] = useState([]);
  const [cart, setCart] = useState("0");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [formData, setFormData] = useState({
    dscode: "",
    totalsp: "",
    netamount: "",
    productDetails: [{ productgroup: "vintage", product: "", quantity: "", price: "", sp: "" }],
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      try {
        const response = await axios.get(`/api/user/find-admin-byemail/${session.user.email}`);
        if (response.data?.name) {
          setFormData((prev) => ({
            ...prev,
            dscode: response.data.dscode || "",
          }));
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Unable to fetch user details.");
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, [session?.user?.email]);

  useEffect(() => {
    const fetchCartData = async () => {
      if (!formData.dscode) return;
      try {
        const response = await axios.get(`/api/cart/userall/${formData.dscode}`);
        setCart(response?.data?.data?.length ?? 0);

      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Unable to fetch user details.");
      } finally {
        setFetching(false);
      }
    };
    fetchCartData();
  }, [formData.dscode]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/Product/Product/fetch/s");
        if (response.data.success) {
          const products = response.data.data;
          setProducts(products);
          const uniqueGroups = [...new Set(products.map((item) => item.group))];
          setProductGroups(uniqueGroups);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Unable to fetch products.");
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedData = { ...prev };

      if (index !== null) {
        const updatedProductDetails = [...prev.productDetails];
        updatedProductDetails[index] = { ...updatedProductDetails[index], [name]: value };

        // Recalculate price, sp, and netamount if product or quantity is changed
        const currentItem = updatedProductDetails[index];
        const selectedProduct = products.find(
          (p) => p.productname === currentItem.product
        );

        if (selectedProduct) {
          const quantity = parseInt(currentItem.quantity) || "";
          updatedProductDetails[index] = {
            ...updatedProductDetails[index],
            quantity,
            price: selectedProduct.dp,            // Single product price
            sp: selectedProduct.sp || 0,            // Selling price
            netamount: selectedProduct.dp * quantity,
          };
        }

        updatedData.productDetails = updatedProductDetails;

        // Calculate total net amount and total selling price across product rows
        const totalNetAmount = updatedProductDetails.reduce(
          (sum, item) => sum + (parseFloat(item.netamount) || 0),
          0
        );

        const totalSp = updatedProductDetails.reduce(
          (sum, item) =>
            sum + (parseFloat(item.sp) || 0) * (parseInt(item.quantity) || 0),
          0
        );

        updatedData.netamount = totalNetAmount + (prev.shippingCharge || 0);
        updatedData.totalsp = totalSp;
      } else {
        updatedData[name] = value;
      }

      return updatedData;
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const isValid = formData.productDetails.every(item =>
      item.productgroup &&
      item.product &&
      item.quantity &&
      parseInt(item.quantity) > 0 // ✅ Quantity must be greater than 0
    );

    if (!isValid) {
      toast.error("All fields are required and quantity must be greater than 0.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/cart/create", formData);
      if (response.data.success) {
        toast.success("Product added to cart successfully!");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };
  const isFormValid = formData.productDetails.every(
    (item) => item.productgroup && item.product && item.quantity
  );
  if (!mounted || fetching) {
    return (
      <div className="flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center ">
      <Toaster />
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800  shadow-lg border border-gray-200 dark:border-gray-700">

        {/* Header */}
        <div className="flex justify-between items-center bg-gray-600 text-white px-5 py-4 text-lg font-semibold">
          <div className="flex items-center gap-2">
            <FilePlus size={20} />
            <span>Create Order</span>
          </div>
          <Link href="./Cart">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} />
              <span>Cart ({cart})</span>
            </div>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formData.productDetails.map((item, index) => (
            <div key={index} className="space-y-4">
              {/* Product Group */}
              <div className=" hidden">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Product Group <span className="text-red-500">*</span>
                </label>
                <select
                  name="productgroup"
                  value={item.productgroup}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full border  px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white text-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Group</option>
                  {productGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Product <span className="text-red-500">*</span>
                </label>
                <select
                  name="product"
                  value={item.product}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full border  px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white text-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Product</option>
                  {products
                    .filter((p) => p.group === item.productgroup)
                    .map((product) => (
                      <option key={product.productname} value={product.productname}>
                        {product.productname}
                      </option>
                    ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full border  px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white text-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full py-2 text-sm font-medium  transition ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bgn hover:bg-blue-700 text-white"
                    }`}
                >
                  {isSubmitting ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
}
