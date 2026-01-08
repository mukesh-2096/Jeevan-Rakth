"use client";
import { useState, useEffect } from "react";

interface ProfileProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const bloodGroups = ['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'];
const idTypes = ['Aadhaar', 'Voter ID', 'Driving License'];
const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function Profile({ user }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [profileData, setProfileData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    mobileNumber: '',
    email: '',
    governmentIdType: '',
    governmentIdNumber: '',
    bloodGroup: '',
    weight: '',
    address: {
      street: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
    }
  });

  // Fetch complete user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          cache: 'no-store', // Prevent caching to always get fresh data
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched profile data:', data.user); // Debug log
          setProfileData({
            fullName: data.user.name || '',
            email: data.user.email || '',
            mobileNumber: data.user.phone || '',
            dateOfBirth: data.user.dateOfBirth || '',
            gender: data.user.gender || '',
            governmentIdType: data.user.governmentIdType || '',
            governmentIdNumber: data.user.governmentIdNumber || '',
            bloodGroup: data.user.bloodGroup || '',
            weight: data.user.weight || '',
            address: data.user.address || {
              street: '',
              city: '',
              district: '',
              state: '',
              pincode: '',
            },
          });
        } else {
          console.error('Failed to fetch profile:', response.statusText);
          setToastMessage('Failed to load profile data');
          setToastType('error');
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setToastMessage('Error loading profile data');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  const age = calculateAge(profileData.dateOfBirth);

  // Government ID validation functions
  const validateAadhaar = (value: string): { valid: boolean; message?: string } => {
    const digits = value.replace(/\s/g, '');
    if (digits.length !== 12) {
      return { valid: false, message: 'Aadhaar must be exactly 12 digits' };
    }
    if (!/^\d{12}$/.test(digits)) {
      return { valid: false, message: 'Aadhaar must contain only numbers' };
    }
    if (digits[0] === '0' || digits[0] === '1') {
      return { valid: false, message: 'Aadhaar cannot start with 0 or 1' };
    }
    return { valid: true };
  };

  const validateVoterId = (value: string): { valid: boolean; message?: string } => {
    if (value.length !== 10) {
      return { valid: false, message: 'Voter ID must be exactly 10 characters' };
    }
    if (!/^[A-Z]{3}[0-9]{7}$/.test(value)) {
      return { valid: false, message: 'Voter ID must have 3 letters followed by 7 digits' };
    }
    return { valid: true };
  };

  const validateDrivingLicense = (value: string): { valid: boolean; message?: string } => {
    // Remove hyphens and spaces for validation
    const cleaned = value.replace(/[-\s]/g, '');
    if (cleaned.length !== 16) {
      return { valid: false, message: 'Driving License must be 16 characters' };
    }
    // Format: SS-RR YY YYYY NNNNNNN (2 letters, 2 letters/digits, 2 digits, 4 digits, 7 digits)
    if (!/^[A-Z]{2}[A-Z0-9]{2}\d{11}$/.test(cleaned)) {
      return { valid: false, message: 'Invalid Driving License format' };
    }
    return { valid: true };
  };

  // Format functions
  const formatAadhaar = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatVoterId = (value: string): string => {
    let cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    // First 3 must be letters
    let letters = cleaned.slice(0, 3).replace(/\d/g, '');
    // Remaining must be digits
    let digits = cleaned.slice(letters.length).replace(/\D/g, '').slice(0, 7);
    return (letters + digits).slice(0, 10);
  };

  const formatDrivingLicense = (value: string): string => {
    // Remove all non-alphanumeric characters
    let cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    
    // First 2 characters: letters (state code)
    let state = cleaned.slice(0, 2).replace(/\d/g, '');
    cleaned = cleaned.slice(state.length);
    
    // Next 2 characters: letters or digits (RTO code)
    let rto = cleaned.slice(0, 2);
    cleaned = cleaned.slice(rto.length);
    
    // Remaining: only digits (max 11)
    let digits = cleaned.replace(/\D/g, '').slice(0, 11);
    
    // Format: SS-RR YY YYYY NNNNNNN
    let result = state;
    if (rto) result += '-' + rto;
    if (digits.length > 0) result += ' ' + digits.slice(0, 2);
    if (digits.length > 2) result += ' ' + digits.slice(2, 6);
    if (digits.length > 6) result += ' ' + digits.slice(6, 13);
    
    return result;
  };

  const handleGovernmentIdChange = (value: string) => {
    let formatted = value;
    
    if (profileData.governmentIdType === 'Aadhaar') {
      formatted = formatAadhaar(value);
    } else if (profileData.governmentIdType === 'Voter ID') {
      formatted = formatVoterId(value);
    } else if (profileData.governmentIdType === 'Driving License') {
      formatted = formatDrivingLicense(value);
    }
    
    setProfileData({ ...profileData, governmentIdNumber: formatted });
  };

  const handleSaveProfile = async () => {
    // Validation: Government ID - both type and number must be provided together
    const hasIdType = profileData.governmentIdType && profileData.governmentIdType.trim() !== '';
    const hasIdNumber = profileData.governmentIdNumber && profileData.governmentIdNumber.trim() !== '';

    if (hasIdType && !hasIdNumber) {
      setToastMessage('Please enter Government ID Number for the selected ID type');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (!hasIdType && hasIdNumber) {
      setToastMessage('Please select Government ID Type for the entered ID number');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Validate Government ID format if both type and number are provided
    if (hasIdType && hasIdNumber) {
      let validation: { valid: boolean; message?: string };
      
      if (profileData.governmentIdType === 'Aadhaar') {
        validation = validateAadhaar(profileData.governmentIdNumber);
      } else if (profileData.governmentIdType === 'Voter ID') {
        validation = validateVoterId(profileData.governmentIdNumber);
      } else if (profileData.governmentIdType === 'Driving License') {
        validation = validateDrivingLicense(profileData.governmentIdNumber);
      } else {
        validation = { valid: true };
      }
      
      if (!validation.valid) {
        setToastMessage(validation.message || 'Invalid Government ID format');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    }

    setLoading(true);
    try {
      const profileUpdateData = {
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        governmentIdType: profileData.governmentIdType,
        governmentIdNumber: profileData.governmentIdNumber,
        bloodGroup: profileData.bloodGroup,
        weight: profileData.weight,
        address: profileData.address,
      };

      console.log('Saving profile data:', profileUpdateData); // Debug log

      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileUpdateData),
      });

      const data = await response.json();
      console.log('Save response:', data); // Debug log

      if (response.ok) {
        setIsEditing(false);
        setToastMessage('Profile updated successfully!');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        // Show the specific error message from the server
        const errorMsg = data.error || 'Failed to update profile';
        console.error('Server error:', errorMsg);
        setToastMessage(errorMsg);
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }
    } catch (error: unknown) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 animate-slide-in-right ${
          toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
          {toastType === 'success' ? (
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <span className="font-semibold">{toastMessage}</span>
          <button
            onClick={() => setShowToast(false)}
            className="ml-auto hover:bg-white/20 rounded p-1 transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 mb-6 border border-red-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Profile Details</h3>
            <p className="text-gray-600">Manage your personal information and health details</p>
          </div>
          {!profileLoading && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {profileLoading ? (
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <span className="text-gray-600 font-medium">Loading profile...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Personal Information</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-red-600">*</span>
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.fullName}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed font-medium"
                />
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Update in My Account settings
              </p>
            </div>

            {/* Date of Birth */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-red-600">*</span>
                Date of Birth
              </label>
              <input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-medium ${
                  isEditing 
                    ? 'border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-900' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              />
              {profileData.dateOfBirth && (
                <p className={`mt-2 text-sm font-semibold flex items-center gap-1 ${age < 18 ? 'text-red-600' : 'text-green-600'}`}>
                  {age < 18 ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  Age: {age} years {age < 18 && '(Must be at least 18)'}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-red-600">*</span>
                Gender
              </label>
              {isEditing ? (
                <div className="flex gap-4 mt-3">
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <label key={gender} className="flex items-center gap-2 cursor-pointer group/radio hover:bg-red-50 px-3 py-2 rounded-lg transition">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={profileData.gender === gender}
                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                        className="w-5 h-5 text-red-600 cursor-pointer focus:ring-2 focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover/radio:text-red-600">{gender}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium">
                  {profileData.gender || 'Not set'}
                </div>
              )}
            </div>

            {/* Mobile Number */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-red-600">*</span>
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={profileData.mobileNumber}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed font-medium"
                />
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Update in My Account settings
              </p>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-red-600">*</span>
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed font-medium"
                />
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Update in My Account settings
              </p>
            </div>
          </div>
        </div>

        {/* Government ID */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Government ID</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Type */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ID Type
              </label>
              <select
                value={profileData.governmentIdType}
                onChange={(e) => {
                  setProfileData({ ...profileData, governmentIdType: e.target.value, governmentIdNumber: '' });
                }}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-medium ${
                  isEditing 
                    ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <option value="">Select ID Type</option>
                {idTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* ID Number */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ID Number
              </label>
              <input
                type="text"
                value={profileData.governmentIdNumber}
                onChange={(e) => handleGovernmentIdChange(e.target.value)}
                disabled={!isEditing || !profileData.governmentIdType}
                placeholder={
                  !profileData.governmentIdType 
                    ? 'Select ID type first' 
                    : profileData.governmentIdType === 'Aadhaar' 
                    ? 'XXXX XXXX XXXX' 
                    : profileData.governmentIdType === 'Voter ID' 
                    ? 'ABC1234567' 
                    : 'KA-01 20 2020 1234567'
                }
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-medium ${
                  isEditing 
                    ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900 placeholder-gray-400' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              />
              {isEditing && profileData.governmentIdType && (
                <p className="mt-2 text-xs text-gray-600">
                  {profileData.governmentIdType === 'Aadhaar' && '12-digit number (e.g., 2345 6789 0123)'}
                  {profileData.governmentIdType === 'Voter ID' && '3 letters + 7 digits (e.g., ABC1234567)'}
                  {profileData.governmentIdType === 'Driving License' && '16 characters (e.g., KA-01 20 2020 1234567)'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Health Information */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Health Information</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Group */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-red-600">*</span>
                Blood Group
              </label>
              <select
                value={profileData.bloodGroup}
                onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-medium ${
                  isEditing 
                      ? 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white text-gray-900' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            {/* Weight */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="text-red-600">*</span>
                Weight (kg)
              </label>
              <input
                type="number"
                value={profileData.weight}
                onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                disabled={!isEditing}
                placeholder="50"
                min="0"
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-medium ${
                  isEditing 
                    ? 'border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white text-gray-900 placeholder-gray-400' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              />
              {profileData.weight && parseFloat(profileData.weight) < 50 && (
                <p className="mt-2 text-sm text-orange-600 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Minimum weight requirement is 50 kg
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Address</h4>
          </div>
          
          <div className="space-y-6">
            {/* Street Address */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={profileData.address.street}
                onChange={(e) => setProfileData({ 
                  ...profileData, 
                  address: { ...profileData.address, street: e.target.value }
                })}
                disabled={!isEditing}
                placeholder="House no, Building, Street"
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-medium ${
                  isEditing 
                    ? 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-900 placeholder-gray-400' 
                    : 'border-gray-200 bg-gray-50 text-gray-700'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  City / Village
                </label>
                <input
                  type="text"
                  value={profileData.address.city}
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    address: { ...profileData.address, city: e.target.value }
                  })}
                  disabled={!isEditing}
                  placeholder="Enter city or village"
                  className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-medium ${
                    isEditing 
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900 placeholder-gray-400' 
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                />
              </div>

              {/* District */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  value={profileData.address.district}
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    address: { ...profileData.address, district: e.target.value }
                  })}
                  disabled={!isEditing}
                  placeholder="Enter district"
                  className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-medium ${
                    isEditing 
                      ? 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-900 placeholder-gray-400' 
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                />
              </div>

              {/* State */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={profileData.address.state}
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    address: { ...profileData.address, state: e.target.value }
                  })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-medium ${
                    isEditing 
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900' 
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              {/* Pincode */}
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={profileData.address.pincode}
                  onChange={(e) => setProfileData({ 
                    ...profileData, 
                    address: { ...profileData.address, pincode: e.target.value }
                  })}
                  disabled={!isEditing}
                  maxLength={6}
                  placeholder="123456"
                  className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-medium ${
                    isEditing 
                      ? 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-gray-900 placeholder-gray-400' 
                      : 'border-gray-200 bg-gray-50 text-gray-700'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Discard Changes
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition font-semibold shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Profile
                </>
              )}
            </button>
          </div>
        )}
        </div>
      )}
    </div>
  );
}
