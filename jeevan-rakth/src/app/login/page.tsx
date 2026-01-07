"use client";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Red Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-red-700 p-12 flex-col justify-between text-white">
        {/* Logo and Tagline */}
        <div>
          <Link href="/" className="flex items-center gap-3 mb-16">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Jeevan-Rakth</h1>
              <p className="text-sm text-red-100">जीवन रक्त • Life Blood</p>
            </div>
          </Link>

          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Every Drop Counts.
              <br />
              Every Life Matters.
            </h2>
            <p className="text-lg text-red-50 leading-relaxed">
              Join India's most advanced blood donation network. Connect donors, hospitals, and NGOs in real-time to save lives.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold mb-1">50K+</div>
            <div className="text-sm text-red-100">Active Donors</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold mb-1">200+</div>
            <div className="text-sm text-red-100">Hospitals</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold mb-1">10K+</div>
            <div className="text-sm text-red-100">Lives Saved</div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h2>
              <p className="text-gray-600">Sign in to your account or create a new one</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-2.5 rounded-md font-semibold transition ${
                  activeTab === "signin"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign In
              </button>
              <Link
                href="/signup"
                className="flex-1 py-2.5 rounded-md font-semibold transition text-center text-gray-600 hover:text-gray-900"
              >
                Sign Up
              </Link>
            </div>

            {/* Sign In Form */}
            <form className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
              >
                Sign In
              </button>

              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Forgot your password?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
