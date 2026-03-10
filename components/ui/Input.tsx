"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 
          placeholder-gray-400 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
          ${error ? "border-red-500 focus:ring-red-500" : ""} 
          ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
