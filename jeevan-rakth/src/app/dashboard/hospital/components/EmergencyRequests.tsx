"use client";
import { useState } from "react";

interface EmergencyRequestsProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function EmergencyRequests({ user }: EmergencyRequestsProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const requestsData = [
    {
      id: 1,
      hospital: 'Apollo Hospital',
      doctor: 'Dr. Rajesh Kumar',
      bloodType: 'O-',
      unitsNeeded: 4,
      location: '2.3 km',
      locationFull: 'Delhi, India',
      requested: '5 mins ago',
      reason: 'Emergency surgery - accident victim',
      phone: '+91 98765 00001',
      priority: 'Critical',
      status: 'Pending',
      priorityColor: 'bg-red-100 text-red-700',
      statusColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 2,
      hospital: 'Max Healthcare',
      doctor: 'Dr. Priya Sharma',
      bloodType: 'A+',
      unitsNeeded: 2,
      location: '5.7 km',
      locationFull: 'Mumbai, India',
      requested: '15 mins ago',
      reason: 'Post-operative care',
      phone: '+91 98765 00002',
      priority: 'High',
      status: 'Pending',
      priorityColor: 'bg-orange-100 text-orange-700',
      statusColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 3,
      hospital: 'Fortis Hospital',
      doctor: 'Dr. Amit Patel',
      bloodType: 'B+',
      unitsNeeded: 3,
      location: '8.2 km',
      locationFull: 'Bangalore, India',
      requested: '1 hour ago',
      reason: 'Planned surgery',
      phone: '+91 98765 00003',
      priority: 'Medium',
      status: 'Pending',
      priorityColor: 'bg-yellow-100 text-yellow-700',
      statusColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 4,
      hospital: 'AIIMS Hospital',
      doctor: 'Dr. Sarah Khan',
      bloodType: 'AB-',
      unitsNeeded: 2,
      location: '3.5 km',
      locationFull: 'Delhi, India',
      requested: '2 hours ago',
      reason: 'Cancer treatment',
      phone: '+91 98765 00004',
      priority: 'High',
      status: 'Fulfilled',
      priorityColor: 'bg-orange-100 text-orange-700',
      statusColor: 'bg-green-100 text-green-700'
    },
    {
      id: 5,
      hospital: 'Manipal Hospital',
      doctor: 'Dr. Vikram Reddy',
      bloodType: 'O+',
      unitsNeeded: 5,
      location: '1.8 km',
      locationFull: 'Hyderabad, India',
      requested: '3 hours ago',
      reason: 'Major trauma',
      phone: '+91 98765 00005',
      priority: 'Critical',
      status: 'Cancelled',
      priorityColor: 'bg-red-100 text-red-700',
      statusColor: 'bg-gray-100 text-gray-700'
    },
  ];

  const pendingCount = requestsData.filter(r => r.status === 'Pending').length;
  const fulfilledToday = requestsData.filter(r => r.status === 'Fulfilled').length;
  const criticalCount = requestsData.filter(r => r.priority === 'Critical').length;

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-x-hidden box-border">
      {/* Header */}
      <div className="mb-6 w-full max-w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Emergency Requests</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage urgent blood requirement requests in real time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 w-full max-w-full">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">Pending Requests</p>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{pendingCount}</p>
          <p className="text-xs sm:text-sm text-gray-600">Requires immediate action</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">Fulfilled Today</p>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">{fulfilledToday}</p>
          <p className="text-xs sm:text-sm text-gray-600">Successfully completed</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs sm:text-sm text-gray-600">Critical Alerts</p>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">{criticalCount}</p>
          <p className="text-xs sm:text-sm text-gray-600">Needs urgent attention</p>
        </div>
      </div>

      {/* All Requests Section */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">All Requests</h2>
      </div>

      {/* Requests List */}
      <div className="space-y-4 w-full max-w-full">
        {requestsData.map((request) => (
          <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition w-full max-w-full overflow-hidden">
            {/* Hospital Name and Status Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 w-full">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{request.hospital}</h3>
                <p className="text-sm text-gray-600">{request.doctor}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${request.priorityColor}`}>
                  {request.priority}
                </span>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${request.statusColor}`}>
                  {request.status}
                </span>
              </div>
            </div>

            {/* Request Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
              {/* Blood Type */}
              <div className="bg-red-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  <span className="text-xs text-gray-600">Blood Type</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-red-600">{request.bloodType}</p>
              </div>

              {/* Units Needed */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-xs text-gray-600">Units Needed</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-blue-600">{request.unitsNeeded} units</p>
              </div>

              {/* Location */}
              <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs text-gray-600">Location</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-green-600">{request.location}</p>
              </div>

              {/* Requested Time */}
              <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-600">Requested</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-purple-600">{request.requested}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-600 mb-1">Reason</p>
                  <p className="text-sm sm:text-base text-gray-900">{request.reason}</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{request.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{request.locationFull}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {request.status === 'Pending' && (
                <button className="flex-1 sm:flex-initial px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer font-medium">
                  Fulfill Request
                </button>
              )}
              <button className="flex-1 sm:flex-initial px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer font-medium">
                Contact Hospital
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
