"use client";

const ContentCard = ({ title, description }) => (
  <div className="flex justify-center py-10">
    <div className="lg:p-8 p-2 max-w-5xl text-center">
      <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
        {title}
      </h2>
      <p className="mt-4 text-lg text-gray-700">{description}</p>
      <div className="mt-6 w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
    </div>
  </div>
);

export default ContentCard;