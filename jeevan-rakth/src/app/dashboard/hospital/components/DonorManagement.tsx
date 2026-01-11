"use client";
import { useState } from "react";

interface DonorManagementProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function DonorManagement({ user }: DonorManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const donorsData = [
    {
      id: '#1',
      name: 'Rahul Sharma',
      initials: 'RS',
      bloodType: 'O+',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@email.com',
      location: 'Delhi, India',
      lastDonation: '45 days ago',
      totalDonations: 12,
      status: 'Available',
      avatar: 'bg-red-500'
    },
    {
      id: '#2',
      name: 'Priya Patel',
      initials: 'PP',
      bloodType: 'A-',
      phone: '+91 98765 43211',
      email: 'priya.patel@email.com',
      location: 'Mumbai, India',
      lastDonation: '20 days ago',
      totalDonations: 8,
      status: 'Available',
      avatar: 'bg-red-500'
    },
    {
      id: '#3',
      name: 'Amit Kumar',
      initials: 'AK',
      bloodType: 'B+',
      phone: '+91 98765 43212',
      email: 'amit.kumar@email.com',
      location: 'Bangalore, India',
      lastDonation: '90 days ago',
      totalDonations: 15,
      status: 'Available',
      avatar: 'bg-red-500'
    },
    {
      id: '#4',
      name: 'Sneha Reddy',
      initials: 'SR',
      bloodType: 'AB+',
      phone: '+91 98765 43213',
      email: 'sneha.reddy@email.com',
      location: 'Hyderabad, India',
      lastDonation: '10 days ago',
      totalDonations: 6,
      status: 'Not Available',
      avatar: 'bg-red-500'
    },
    {
      id: '#5',
      name: 'Vikram Singh',
      initials: 'VS',
      bloodType: 'O-',
      phone: '+91 98765 43214',
      email: 'vikram.singh@email.com',
      location: 'Chennai, India',
      lastDonation: '60 days ago',
      totalDonations: 20,
      status: 'Available',
      avatar: 'bg-red-500'
    },
  ];

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-x-hidden box-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 w-full max-w-full">
        <div className="min-w-0 flex-1 max-w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Donor Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and track all registered blood donors</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer whitespace-nowrap flex-shrink-0 w-full sm:w-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add New Donor</span>
          <span className="sm:hidden">Add Donor</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 w-full max-w-full">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Donors</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">10,234</p>
          <p className="text-xs sm:text-sm text-green-600">+142 this month</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Available Now</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">8,567</p>
          <p className="text-xs sm:text-sm text-gray-600">83.7% of total</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Active This Month</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">342</p>
          <p className="text-xs sm:text-sm text-gray-600">Recent donations</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">New Registrations</p>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">142</p>
          <p className="text-xs sm:text-sm text-gray-600">This month</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-6 w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-full">
          <div className="flex-1 relative min-w-0 w-full sm:w-auto max-w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search donors by name, blood type, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-full pl-9 sm:pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent box-border"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer whitespace-nowrap flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Donors List - Mobile Card View (hidden on lg screens) */}
      <div className="lg:hidden space-y-4 w-full max-w-full">
        {donorsData.map((donor) => (
          <div key={donor.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${donor.avatar} rounded-full flex items-center justify-center text-white font-semibold`}>
                  {donor.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{donor.name}</p>
                  <p className="text-xs text-blue-600">{donor.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                <span className="text-sm font-bold text-gray-900">{donor.bloodType}</span>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{donor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{donor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{donor.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Last Donation</p>
                <p className="font-medium text-gray-900">{donor.lastDonation}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Donations</p>
                <p className="font-medium text-gray-900">{donor.totalDonations} times</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                donor.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {donor.status}
              </span>
              <button className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Donors Table - Desktop View (hidden on mobile/tablet) */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden w-full max-w-full">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Blood Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Donation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total Donations</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donorsData.map((donor) => (
                <tr key={donor.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${donor.avatar} rounded-full flex items-center justify-center text-white font-semibold`}>
                        {donor.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{donor.name}</p>
                        <p className="text-xs text-blue-600">{donor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-900">{donor.bloodType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm text-gray-900">{donor.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">{donor.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm text-gray-900">{donor.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">{donor.lastDonation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{donor.totalDonations} times</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      donor.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {donor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer">
                      Contact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
