import React from 'react';

export default function Input({ name, icon, className = '', ...props }) {
    return (
        <div className="relative">
            <label htmlFor={name} className="px-2 absolute h-full flex items-center text-[#161950]">
                {icon}
            </label>
            <input
                id={name}
                name={name}
                className={`block w-full px-7 py-3 text-gray-500 bg-white border border-gray-200 rounded-md appearance-none placeholder:text-gray-400 focus:border-[#161950] focus:outline-none focus:ring-[#161950] sm:text-sm ${className}`}
                aria-label={name}
                {...props}
            />
        </div>
    );
}
