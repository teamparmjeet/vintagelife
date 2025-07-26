"use client";

import Link from "next/link";

const ContentBtnCard = ({
  title,
  description,
  knowMoreLink = "#",
  contactUsLink = "#",
}) => (
  <div className="flex justify-center py-10">
    <div className="lg:p-8 p-4 max-w-5xl text-center">
      <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
        {title}
      </h2>
      <p className="mt-4 text-lg lg:text-xl text-gray-700">{description}</p>
      <div className="mt-6 w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>

      {/* Responsive Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-4 sm:space-y-0">
        {/* Know More Button */}
        <Link href={knowMoreLink}>
          <button className="w-full sm:w-auto px-7 py-3 text-lg font-semibold text-white bg-gradient-to-br from-green-800 to-green-600 border-2 border-green-800 rounded-full transition-all duration-300 hover:from-green-900 hover:to-green-700">
            Know More
          </button>
        </Link>

        {/* Contact Us Button */}
        <Link href={contactUsLink}>
          <button className="w-full sm:w-auto px-7 py-3 text-lg font-semibold text-green-800 bg-white border-2 border-green-800 rounded-full transition-all duration-300 hover:bg-green-800 hover:text-white">
            Contact Us
          </button>
        </Link>
      </div>
    </div>
  </div>
);

export default ContentBtnCard;
