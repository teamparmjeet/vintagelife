"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Limagecard = ({
  title = "Default Title",
  description = "No description",
  viewmore = "#",
  image,
  sideimage,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevents hydration errors

  return (
    <div className="relative flex flex-col md:flex-row items-center bg-white shadow-xl rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Left Section - Main Image */}
      <div className="relative w-full overflow-hidden md:w-1/2">
        {image ? (
          <Image
            src={image}
            width={600}
            height={500}
            className=" object-cover  rounded-l-3xl"
            alt={title}
            priority
          />
        ) : (
          <div className="w-full h-[600px] bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Right Section - Content */}
      <div className="flex flex-col justify-center items-start p-10 md:p-14 w-full md:w-1/2  rounded-r-3xl">
        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight z-20">
          {title}
        </h2>
        <p className="mt-4 text-lg text-gray-700">{description}</p>
        {/* <Link href={viewmore}>
          <button className="mt-6 px-7 py-3 text-lg font-semibold text-green-800 bg-white border-2 border-green-800 rounded-full transition-all duration-300 hover:bg-green-800 hover:text-white">
            View {title}
          </button>
        </Link> */}

        {/* Side Image */}
        {/* <div className="hidden md:block">
          {sideimage && (
            <div className="absolute top-[-10px] right-[-10px] lg:top-[0px] lg:right-[20px] w-36 h-36 lg:w-48 lg:h-48 xl:w-64 xl:h-64 transform -rotate-3 backdrop-blur-lg shadow-xl opacity-80 hover:opacity-100 transition-opacity duration-300 z-0">
              <Image
                src={sideimage}
                width={250}
                height={250}
                className="w-full h-full object-cover rounded-xl shadow-lg transition-transform duration-300 hover:scale-110"
                alt="Side Image"
                priority
              />
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default Limagecard;
