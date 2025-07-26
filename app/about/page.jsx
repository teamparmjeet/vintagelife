"use client";

import React from "react";
import Header from "@/components/homepage/Header";
import Footer from "@/components/homepage/Footer";
import Image from "next/image";
import { Factory, ShoppingBag, Users, HeartHandshake } from "lucide-react";

export default function page() {
  return (
    <>
      <Header />
      <section
        className="relative h-[350px] sm:h-[450px] lg:h-[550px] flex items-center justify-center bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/images/homepage/aboutbg.jpg')" }}
      >
        {/* Overlay with Subtle Animation */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        {/* Content Container */}
        <div className="relative z-10 text-center px-6">
          {/* Animated Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold tracking-wide uppercase transform transition-all duration-500 hover:scale-105">
            Who We Are 
          </h1>

          {/* Highlighted Tagline */}
          <p className="mt-4 text-lg md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
            <span className="text-green-400 font-semibold">Innovating</span>{" "}
            with
            <span className="text-yellow-400 font-semibold"> Excellence</span> &
            <span className="text-blue-400 font-semibold"> Integrity</span>.
          </p>

          {/* Decorative Elements */}
          <div className="mt-6 flex justify-center space-x-3">
            <div className="w-6 h-6 bg-green-400 rounded-full animate-wave delay-0"></div>
            <div className="w-6 h-6 bg-yellow-400 rounded-full animate-wave delay-200"></div>
            <div className="w-6 h-6 bg-blue-400 rounded-full animate-wave delay-400"></div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <a href="/contact">
              <button className="px-3 md:px-6 py-2 md:py-3 text-md md:text-lg font-semibold bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-200 transition-all">
                Learn More
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-3 md:px-6 py-6 md:py-12">
        {/* Background Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-green-700">Our Journey</h2>
          <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
            ANAADIPRO  Wellness Private Limited started in 2014 as a direct
            selling entity, committed to ethical business practices and growth
            opportunities.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {/* Products */}
          <div className="p-6 bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all">
            <ShoppingBag className="w-14 h-14 text-green-700 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Wide Product Range</h3>
            <p className="mt-2 text-gray-600">
              From healthcare to beauty, we offer high-quality products with
              scientific formulations and green ingredients.
            </p>
          </div>

          {/* Manufacturing */}
          <div className="p-6 bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Factory className="w-14 h-14 text-green-700 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Own Manufacturing</h3>
            <p className="mt-2 text-gray-600">
              Our in-house plant ensures top-notch quality control and product
              availability across India.
            </p>
          </div>

          {/* Outlets */}
          <div className="p-6 bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Users className="w-14 h-14 text-green-700 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">550+ Outlets</h3>
            <p className="mt-2 text-gray-600">
              With a vast distribution network, our products reach every corner
              of India.
            </p>
          </div>

          {/* Social Responsibility */}
          <div className="p-6 bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-all">
            <HeartHandshake className="w-14 h-14 text-green-700 mx-auto" />
            <h3 className="text-2xl font-semibold mt-4">Social Impact</h3>
            <p className="mt-2 text-gray-600">
              Beyond business, we focus on social upliftment and ethical
              practices.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-10">
          <h2 className="text-3xl font-bold text-green-700">
            Join Our Mission
          </h2>
          <p className="text-lg text-gray-700 mt-4">
            Experience the power of quality products and financial freedom. Be a
            part of ANAADIPRO  Wellness today!
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block px-8 py-3 text-lg font-semibold text-white bg-green-700 rounded-full shadow-lg hover:bg-green-800 transition-all"
          >
            Get in Touch
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}
