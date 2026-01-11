"use client";
import { useState } from "react";

interface PersonalDetailsProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function PersonalDetails({ formData, updateFormData, errors }: PersonalDetailsProps) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(formData.dateOfBirth);

  // Check if any pre-filled data exists
  const hasPrefilledData = formData.fullName || formData.dateOfBirth || formData.gender || formData.mobileNumber;

  const handleClearPrefilledData = () => {
    updateFormData('fullName', '');
    updateFormData('dateOfBirth', '');
    updateFormData('gender', '');
    updateFormData('mobileNumber', '');
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
              <p className="text-sm text-gray-600">Please provide your basic information</p>
            </div>
          </div>
          {hasPrefilledData && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-white border-2 border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
            >
              Clear Pre-filled
            </button>
          )}
        </div>
      </div>

      {/* Info Banner for Pre-filled Data */}
      {hasPrefilledData && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-900">Information Pre-filled from Your Profile</p>
              <p className="text-xs text-blue-700 mt-1">We've filled in some details from your account. You can review and update them as needed, or click "Clear Pre-filled" to start fresh.</p>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Pre-filled Data?</h3>
            <p className="text-sm text-gray-600 mb-6">This will remove all pre-filled information from this form. You'll need to enter all details manually.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleClearPrefilledData}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          Full Name <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.fullName || ''}
            onChange={(e) => updateFormData('fullName', e.target.value)}
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 pl-11 border rounded-lg focus:ring-2 outline-none transition shadow-sm text-gray-900 placeholder-gray-400 ${
              errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
            }`}
          />
          <div className="absolute left-3 top-3.5 text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
        </div>
        {errors.fullName && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.fullName}</p>}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Date of Birth <span className="text-red-600">*</span>
        </label>
        <input
          type="date"
          value={formData.dateOfBirth || ''}
          onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-1 outline-none transition text-gray-900 ${
            errors.dateOfBirth ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
          }`}
        />
        {formData.dateOfBirth && (
          <p className={`mt-1 text-sm ${age < 18 ? 'text-red-600' : 'text-gray-600'}`}>
            Age: {age} years {age < 18 && '(Must be at least 18 years old)'}
          </p>
        )}
        {errors.dateOfBirth && <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Gender <span className="text-red-600">*</span>
        </label>
        <div className="flex gap-3">
          {['Male', 'Female', 'Other'].map((gender) => (
            <label key={gender} className={`flex-1 flex items-center justify-center gap-2 cursor-pointer px-4 py-3 border-2 rounded-lg transition-all ${
              formData.gender === gender
                ? 'border-red-600 bg-red-50 text-red-700 shadow-md'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}>
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData.gender === gender}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-4 h-4 text-red-600 cursor-pointer"
              />
              <span className="text-sm font-medium">{gender}</span>
            </label>
          ))}
        </div>
        {errors.gender && <p className="mt-2 text-xs text-red-600 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.gender}</p>}
      </div>

      {/* Mobile Number */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Mobile Number <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            value={formData.mobileNumber || ''}
            onChange={(e) => updateFormData('mobileNumber', e.target.value)}
            placeholder="9876543210"
            maxLength={10}
            className={`w-full px-4 py-3 pl-11 border rounded-lg focus:ring-2 outline-none transition shadow-sm text-gray-900 placeholder-gray-400 ${
              errors.mobileNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500 focus:ring-red-500'
            }`}
          />
          <div className="absolute left-3 top-3.5 text-gray-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </div>
        </div>
        <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          OTP verification will be sent to this number
        </p>
        {errors.mobileNumber && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.mobileNumber}</p>}
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => updateFormData('email', e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Government ID */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Government ID Number <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          type="text"
          value={formData.governmentId || ''}
          onChange={(e) => updateFormData('governmentId', e.target.value)}
          placeholder="Aadhaar / Voter ID / Driving License"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition text-gray-900 placeholder-gray-400"
        />
      </div>
    </div>
  );
}
