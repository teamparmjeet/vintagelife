"use client";

export default function Footer() {
  return (
<footer className="bg-gray-200 text-gray-700 text-center py-6 mt-10">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center gap-y-6 text-sm md:text-base">
    
    {/* Company Info */}
    <div className="lg:text-left">
      <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 uppercase tracking-wide">
        ANAADIPRO WELLNESS
      </h2>
      <p className="mt-1 text-gray-600">Empowering Health & Wellness Since 2025</p>
    </div>

    {/* Navigation Links */}
    <div className="flex flex-wrap justify-center lg:justify-center space-x-4 md:space-x-6 font-medium">
      <a href="/about" className="hover:text-gray-900 transition duration-300">About Us</a>
      <span className="hidden md:inline opacity-50">|</span>
      <a href="/contact" className="hover:text-gray-900 transition duration-300">Contact</a>
    </div>

    {/* Copyright */}
    <div className="lg:text-right">
      <p className="text-xs md:text-sm text-gray-500">
        © {new Date().getFullYear()} ANAADIPRO WELLNESS. All Rights Reserved.
      </p>
    </div>

  </div>
</footer>

  );
}
