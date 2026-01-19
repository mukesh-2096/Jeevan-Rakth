"use client";
import { useState, useEffect } from "react";

export default function ProfileSettings() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
    },
    registrationNumber: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
    },
    registrationNumber: '',
    description: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  // Track form changes only when editing
  useEffect(() => {
    if (isEditing) {
      const dataChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
      setHasChanges(dataChanged);
    }
  }, [formData, originalData, isEditing]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        const profileData = {
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: {
            street: data.user.address?.street || '',
            city: data.user.address?.city || '',
            district: data.user.address?.district || '',
            state: data.user.address?.state || '',
            pincode: data.user.address?.pincode || '',
          },
          registrationNumber: data.user.registrationNumber || '',
          description: data.user.description || '',
        };
        setFormData(profileData);
        setOriginalData(profileData);
        setHasChanges(false);
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: 'Failed to load profile' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setSaved(true);
        setHasChanges(false);
        setIsEditing(false);
        
        // Update the form with the latest data
        if (data.user) {
          const updatedData = {
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            address: {
              street: data.user.address?.street || '',
              city: data.user.address?.city || '',
              district: data.user.address?.district || '',
              state: data.user.address?.state || '',
              pincode: data.user.address?.pincode || '',
            },
            registrationNumber: data.user.registrationNumber || '',
            description: data.user.description || '',
          };
          setFormData(updatedData);
          setOriginalData(updatedData);
        }
        
        // Auto-hide success message and saved state after 3 seconds
        setTimeout(() => {
          setMessage(null);
          setSaved(false);
        }, 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaved(false);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setHasChanges(false);
    setMessage(null);
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        {/* Loading Skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="space-y-6">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-2 gap-6">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your NGO information and contact details</p>
        </div>
        <div className="flex items-center gap-4">
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          )}
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Success/Error Toast */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 min-w-[320px] max-w-md shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 ${
          message.type === 'success' 
            ? 'bg-white border-l-4 border-green-500' 
            : 'bg-white border-l-4 border-red-500'
        }`}>
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {message.type === 'success' ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-semibold ${
                  message.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {message.type === 'success' ? 'Success!' : 'Error'}
                </h3>
                <p className={`text-sm mt-1 ${
                  message.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {message.text}
                </p>
              </div>
              <button
                onClick={() => setMessage(null)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 px-8 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                <p className="text-sm text-gray-600">Your NGO&apos;s primary details</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NGO Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  NGO Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                    isEditing 
                      ? 'focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-gray-400' 
                      : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Enter NGO name"
                  disabled={!isEditing}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Email cannot be changed for security reasons
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                    isEditing 
                      ? 'focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-gray-400' 
                      : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="+91 98765 43210"
                  disabled={!isEditing}
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Registration Number
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                    isEditing 
                      ? 'focus:ring-2 focus:ring-red-500 focus:border-transparent hover:border-gray-400' 
                      : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="NGO/2024/123456"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Address Information</h2>
                <p className="text-sm text-gray-600">Your NGO&apos;s location details</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Street Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                    isEditing 
                      ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                      : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Building name, Floor, Street name"
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* City */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                    placeholder="Mumbai"
                    disabled={!isEditing}
                  />
                </div>

                {/* District */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    District
                  </label>
                  <input
                    type="text"
                    value={formData.address.district}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, district: e.target.value }
                    })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                    placeholder="Mumbai Suburban"
                    disabled={!isEditing}
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={formData.address.pincode}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, pincode: e.target.value }
                    })}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                        : 'bg-gray-50 cursor-not-allowed'
                    }`}
                    placeholder="400001"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  State
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    address: { ...formData.address, state: e.target.value }
                  })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                    isEditing 
                      ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-gray-400' 
                      : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Maharashtra"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* About NGO Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">About Your NGO</h2>
                <p className="text-sm text-gray-600">Describe your mission and impact</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Organization Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all resize-none ${
                isEditing 
                  ? 'focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400' 
                  : 'bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Tell us about your NGO's mission, vision, activities, and the communities you serve..."
              disabled={!isEditing}
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              This information helps donors and hospitals learn more about your organization
            </p>
          </div>
        </div>

        {/* Action Buttons - Only shown when editing */}
        {isEditing && (
          <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>All changes will be saved to your profile</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !hasChanges || saved}
                className={`px-8 py-3 rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2 ${
                  saved 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-green-500/30' 
                    : !hasChanges
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-red-500/30'
                } ${(loading || !hasChanges) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </>
                ) : saved ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Saved!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {hasChanges ? 'Save Changes' : 'No Changes'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
