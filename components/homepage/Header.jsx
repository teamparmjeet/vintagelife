"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, LogIn, ChevronDown, UserPlus } from "lucide-react";
import ProductModal from "./ProductModal ";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Fetch products dynamically
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/Product/Product/fetch/AllProduct");
        const data = await response.json();
        if (data.success) setProducts(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    // Handle sticky header
    const handleScroll = () => {
      setIsFixed(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`bg-white shadow-md py-1 px-6 grid grid-cols-3 items-center justify-between w-full z-50 transition-transform duration-800 ${
          isFixed ? "fixed top-0 left-0 right-0 translate-y-0" : "relative"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-3 text-gray-800 rounded-md hover:bg-gray-200 transition"
          >
            <Menu size={28} />
          </button>

          <div className="hidden lg:flex items-center gap-6">
            {/* Language Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="flex items-center p-2 text-gray-700 font-medium hover:text-green-600 transition">
                Products <ChevronDown size={18} className="ml-1" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute left-0 mt-0 w-60 bg-white/90 border border-gray-300 shadow-lg rounded-lg p-2 z-50">
                  {products.length > 0 ? (
                    <ul className="space-y-2">
                      {products.slice(0, 10).map((product) => (
                        <li key={product._id}>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowDropdown(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                          >
                            {product.productname}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center text-gray-500 p-2">Loading...</p>
                  )}
                </div>
              )}
            </div>

            {/* Register Button */}
            <Link href="/signup">
              <button className="px-5 py-2 text-lg font-medium  border-green-700 rounded-full shadow-md border-2  flex items-center gap-2">
                <UserPlus size={20} />
                Register Now
              </button>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center ">
          <Link href="/">
            <Image
              src="/images/logo/logo-blank.png"
              alt="Logo"
              width={70}
              height={70}
              className="hover:opacity-80 transition"
            />
          </Link>
        </div>

        <div className="flex items-center justify-end space-x-6">
{/* 
          <Link
            href="/about"
            className="text-lg font-medium text-gray-800 transition-all duration-300 hover:text-green-700 hidden lg:block"
          >
            ABOUT
          </Link>

       
          <Link
            href="/contact"
            className="text-lg font-medium text-gray-800 transition-all duration-300 hover:text-green-700 hidden lg:block"
          >
            CONTACT
          </Link> */}

          {/* Login Button */}
          <Link href="/signin">
            <button className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-green-700 to-green-600 rounded-full shadow-md transition-all duration-300 hover:from-green-800 hover:to-green-700 focus:ring-2 focus:ring-green-400  items-center gap-2 hidden md:flex">
              <LogIn className="w-5 h-5" />
              Login
            </button>
          </Link>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-black/80 bg-opacity-50 z-50 transition-opacity ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-lg transform transition-transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 hover:text-red-500"
            >
              <X size={28} />
            </button>
          </div>

          <nav className="p-4">
            <ul className="space-y-4 text-gray-800">
              <li>
                <Link href="/" className="hover:text-blue-500 block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-blue-500 block">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-500 block">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-500 block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-blue-500 block">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
