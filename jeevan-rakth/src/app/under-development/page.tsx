"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UnderDevelopment() {
  const router = useRouter();

  useEffect(() => {
    // Redirect back after 3 seconds
    const timer = setTimeout(() => {
      router.back();
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff1f1] to-white">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-yellow-600"
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
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Feature Under Development
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, Google Sign-In is currently under development. Please use email and password to continue.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-red-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
          </div>

          <p className="text-sm text-gray-500">
            Redirecting you back in a moment...
          </p>

          {/* Manual Back Button */}
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md cursor-pointer"
          >
            Go Back Now
          </button>
        </div>
      </div>
    </div>
  );
}
