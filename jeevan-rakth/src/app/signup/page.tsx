"use client";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [userType, setUserType] = useState<"donor" | "hospital" | "ngo" | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex bg-[#fff7f7]">

      {/* LEFT BRAND PANEL - FIXED */}
      <div className="hidden lg:flex lg:w-1/2 flex-col px-20 bg-gradient-to-br from-[#fff1f1] to-white sticky top-0 h-screen">
        {/* Home Button */}
        <div className="absolute top-8 left-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition group cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-semibold">Home</span>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">
          <h1
            className="text-5xl font-bold text-[#1e1e1e] mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join Jeevan-Rakth
          </h1>
          <p className="text-lg text-gray-600 max-w-md">
            A real-time blood donation platform connecting donors, hospitals, and NGOs
            to save lives across India.
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL - SCROLLABLE */}
      <div className="w-full lg:w-1/2 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 my-6">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Choose your role and get started
            </p>
          </div>

          {/* ROLE SELECTION */}
          {!userType && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">

                {[
                  { id: "donor", label: "Donor", desc: "Donate blood & save lives" },
                  { id: "hospital", label: "Hospital", desc: "Manage blood inventory" },
                  { id: "ngo", label: "NGO", desc: "Organize donation drives" },
                ].map(role => (
                  <button
                    key={role.id}
                    onClick={() => setUserType(role.id as any)}
                    className="flex items-center justify-between p-5 border rounded-xl hover:border-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900">{role.label}</h4>
                      <p className="text-sm text-gray-600">{role.desc}</p>
                    </div>
                    <span className="text-red-600 font-semibold">Select →</span>
                  </button>
                ))}
              </div>

              {/* Already have an account */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold cursor-pointer">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* FORM */}
          {userType && (
            <form onSubmit={(e) => { e.preventDefault(); console.log(formData, userType); }} className="space-y-5">

              <button
                type="button"
                onClick={() => setUserType(null)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Change role
              </button>

              {/* Role Badge */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      {userType === "donor" && (
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      )}
                      {userType === "hospital" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      )}
                      {userType === "ngo" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Signing up as</p>
                    <p className="font-bold text-gray-900 capitalize">{userType}</p>
                  </div>
                </div>
              </div>

              {/* NAME */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {userType === "hospital" ? "Hospital Name" : "Full Name"}
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  placeholder={userType === "hospital" ? "City Hospital" : "John Doe"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition text-gray-900"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition text-gray-900"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* PHONE */}
              {(userType === "donor" || userType === "ngo") && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition text-gray-900"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition text-gray-900"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition text-gray-900"
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* TERMS */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                  required
                />
                <label className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link href="/terms" className="text-red-600 hover:text-red-700 font-semibold cursor-pointer">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-red-600 hover:text-red-700 font-semibold cursor-pointer">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md cursor-pointer"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign Up Button */}
              <button
                type="button"
                className="w-full py-3.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
