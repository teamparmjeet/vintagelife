import React from "react";

export default function SecCard({ children }) {
  return (
    <div className="container mx-auto px-8 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
}
