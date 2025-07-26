"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Rimagecard = ({
  title = "Default Title",
  description = "No description available.",
  viewmore = "#",
  image,
  sideimage,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative flex flex-col md:flex-row-reverse items-center md:items-stretch bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Right Section - Image */}
      <div className="relative w-full md:w-1/2 flex justify-end">
        {image ? (
          <Image
            src={image}
            width={600}
            height={600}
            className="object-cover  md:rounded-r-3xl"
            alt={title}
            priority
          />
        ) : (
          <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Left Section - Content */}
      <div className="relative flex flex-col justify-center text-left p-10 md:p-14 w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-white md:rounded-l-3xl space-y-6">
        <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
        <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
        {/* <div className="mt-4">
          <Link href={viewmore}>
            <button className="px-6 py-3 text-base font-semibold text-white bg-green-700 hover:bg-green-800 rounded-full transition-all duration-300">
              View More
            </button>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default Rimagecard;
