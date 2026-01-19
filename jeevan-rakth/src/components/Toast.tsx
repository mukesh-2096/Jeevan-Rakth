"use client";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg ${
          type === "success"
            ? "bg-green-50 border border-green-200"
            : type === "error"
            ? "bg-red-50 border border-red-200"
            : type === "warning"
            ? "bg-yellow-50 border border-yellow-200"
            : "bg-blue-50 border border-blue-200"
        }`}
      >
        {type === "success" ? (
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : type === "error" ? (
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : type === "warning" ? (
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <p
          className={`font-medium ${
            type === "success" 
              ? "text-green-800" 
              : type === "error"
              ? "text-red-800"
              : type === "warning"
              ? "text-yellow-800"
              : "text-blue-800"
          }`}
        >
          {message}
        </p>
        <button
          onClick={onClose}
          className={`ml-4 ${
            type === "success"
              ? "text-green-600 hover:text-green-800"
              : type === "error"
              ? "text-red-600 hover:text-red-800"
              : type === "warning"
              ? "text-yellow-600 hover:text-yellow-800"
              : "text-blue-600 hover:text-blue-800"
          } cursor-pointer`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
