"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

export default function CarAchievers() {
  const [carAchievers, setCarAchievers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarAchievers = async () => {
      try {
        const response = await axios.get("/api/achivers/fetchbytype/Car Achiever");
        setCarAchievers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching car achievers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarAchievers();
  }, []);

  return (
    <div className="mx-auto lg:p-6 p-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg text-gray-700 dark:text-white">
      <h2 className="text-2xl font-semibold mb-4 text-center">Car Achievers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-4 bg-gray-200 dark:bg-gray-800 rounded-xl shadow-lg animate-pulse flex flex-col items-center"
              >
                <div className="w-64 h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="mt-3 text-center w-2/3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))
          : carAchievers.map((achiever) => (
              <div
                key={achiever._id}
                className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg flex flex-col items-center"
              >
                <div className="relative w-64 h-64">
                  <Image
                    src={achiever.image}
                    alt={achiever.name}
                    fill
                    className="object-cover rounded-lg border-4 border-gray-300 dark:border-gray-600 shadow-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    priority
                  />
                </div>
                <p className=" font-semibold text-black mt-2">{achiever.name}</p>
                <p className=" text-sm">ID: {achiever.dsid}</p>
                <p className=" text-black">Crown Ambassador</p>
                <p>{achiever.address}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
