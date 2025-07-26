"use client";
import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Youcrousel() {
  // Replace with actual YouTube embed links
  const videos = [
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/3JZ_D3ELwOQ",
    "https://www.youtube.com/embed/tgbNymZ7vqY",
    "https://www.youtube.com/embed/kJQP7kiw5Fk",
  ];

  const [hover, setHover] = useState(false);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 3 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  // Custom Arrows
  const CustomLeftArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-gray-800 p-2 rounded-full transition-opacity duration-300 ${
        hover ? "opacity-100" : "opacity-50"
      } hover:opacity-100`}
    >
      <ChevronLeft size={30} />
    </button>
  );

  const CustomRightArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-gray-800 p-2 rounded-full transition-opacity duration-300 ${
        hover ? "opacity-100" : "opacity-50"
      } hover:opacity-100`}
    >
      <ChevronRight size={30} />
    </button>
  );

  return (
    <div
      className="max-w-7xl mx-auto p-0 relative group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={4000}
        keyBoardControl
        removeArrowOnDeviceType={["tablet", "mobile"]}
        containerClass="carousel-container"
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        showDots={false} // No dots
      >
        {videos.map((video, index) => (
          <div key={index} className="h-full w-full p-4 flex justify-center">
            <iframe
              width="100%"
              height="300"
              src={video}
              title={`YouTube Video ${index + 1}`}
              allowFullScreen
              className="rounded-lg shadow-lg border border-gray-300"
            ></iframe>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
