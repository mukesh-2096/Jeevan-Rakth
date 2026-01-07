"use client";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");
  const [userType, setUserType] = useState<"donor" | "hospital" | "ngo">("donor");

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
              <Link
                href="/login"
                className="flex-1 py-2.5 rounded-md font-semibold transition text-center text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-2.5 rounded-md font-semibold transition ${
                  activeTab === "signup"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Sign Up Form */}
            <form className="space-y-5">
              <div>
                <label htmlFor="fullname" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="fullname"
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                    required
                  />
                </div>
              </div>

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
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  I am a
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType("donor")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                      userType === "donor"
                        ? "border-red-600 bg-red-50 text-red-600"
                        : "border-gray-300 hover:border-gray-400 text-gray-600"
                    }`}
                  >
                    <svg className="w-6 h-6 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    <span className="text-sm font-semibold">Donor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("hospital")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                      userType === "hospital"
                        ? "border-red-600 bg-red-50 text-red-600"
                        : "border-gray-300 hover:border-gray-400 text-gray-600"
                    }`}
                  >
                    <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-sm font-semibold">Hospital</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("ngo")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                      userType === "ngo"
                        ? "border-red-600 bg-red-50 text-red-600"
                        : "border-gray-300 hover:border-gray-400 text-gray-600"
                    }`}
                  >
                    <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-semibold">NGO</span>
                  </button>
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
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
