"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("/api/dashboardimage/fetch/Dashboardimage");
        setImages(response.data.data || []);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load images.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images]);

  // Manual navigation
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {loading ? (
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full bg-gray-100 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 text-lg sm:text-xl font-bold py-16 sm:py-20">
          {error}
        </p>
      ) : images.length > 0 ? (
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] w-full">
          {/* Image Display */}
          <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-xl">
            <Link href={images[currentIndex].image} target="_blank">
              <Image
                src={images[currentIndex].image}
                alt={`Featured Image ${currentIndex + 1}`}
                fill
                priority={currentIndex === 0}
                className="object-contain transition-opacity duration-700 ease-in-out"
              />
              <div className="absolute inset-0  opacity-70 transition-opacity duration-300 md:hover:opacity-50"></div>
            </Link>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 sm:p-3 rounded-full shadow-md opacity-75 transition-opacity duration-300 md:hover:bg-white md:hover:opacity-100"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2 sm:p-3 rounded-full shadow-md opacity-75 transition-opacity duration-300 md:hover:bg-white md:hover:opacity-100"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center gap-2 sm:gap-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-white scale-125"
                      : "bg-white/50 md:hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center">
          <p className="text-center text-gray-600 text-lg sm:text-xl md:text-2xl font-semibold px-4">
            No images available to display.
          </p>
        </div>
      )}
    </div>
  );
}