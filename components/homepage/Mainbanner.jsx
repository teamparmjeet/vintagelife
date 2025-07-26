"use client";
import Image from "next/image";

export default function Mainbanner() {
  const imagePath = "/images/homepage/photo-1514733670139-4d87a1941d55.webp";

  return (
    <div className="relative w-full">
      {/* Background Image */}
      <Image
        src={imagePath}
        alt="Main banner"
        width={1920}
        height={1080}
        priority
        className="w-full object-cover rounded-lg h-auto md:h-screen"
      />

      {/* Stylish Heading Overlay */}
      <div className="absolute top-10 left-0 z-10 px-4 py-2 rounded-r-full bg-gradient-to-r from-white/80 to-green-100 backdrop-blur-md shadow-lg hidden md:block">
        <h1 className="text-green-900 text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold tracking-wide">
          ANAADIPRO WELLNESS PRIVATE LIMITED
        </h1>
      </div>
    </div>
  );
}
