"use client";
import React, { useState, useEffect } from "react";
import { ThumbsUp, Facebook, Twitter, Instagram, Linkedin, ChevronUp } from "lucide-react";

export default function FloatingActions() {
  const [showSocialIcons, setShowSocialIcons] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const handleScroll = () => {
      setShowScroll(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hasMounted) return null;

  return (
    <>
      {/* Floating Social Media Buttons */}
      <div className="fixed right-4 bottom-24 flex flex-col items-center justify-center z-30">
        <button
          onClick={() => setShowSocialIcons(!showSocialIcons)}
          className="p-4 bg-green-600 text-white rounded-full shadow-lg transition-transform duration-300 hover:scale-110 flex items-center justify-center"
        >
          <ThumbsUp size={28} />
        </button>

        {/* Social Icons */}
        <div
          className={`absolute right-14 flex gap-3 items-center transition-all duration-500 me-4 ${
            showSocialIcons ? "opacity-100 translate-x-0" : "opacity-0 translate-x-5 pointer-events-none"
          }`}
        >
          <a href="#" className="bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition">
            <Facebook size={24} />
          </a>
          <a href="#" className="bg-blue-500 p-3 rounded-full text-white hover:bg-blue-600 transition">
            <Twitter size={24} />
          </a>
          <a href="#" className="bg-pink-500 p-3 rounded-full text-white hover:bg-pink-600 transition">
            <Instagram size={24} />
          </a>
          <a href="#" className="bg-blue-800 p-3 rounded-full text-white hover:bg-blue-900 transition">
            <Linkedin size={24} />
          </a>
        </div>
      </div>

      {/* Scroll-to-Top Button */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-4 bottom-4 p-3 border-2 border-green-800 text-green-900 rounded-full shadow-lg transition hover:bg-green-800 hover:text-white z-30"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
}
