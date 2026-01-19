"use client";
import { useState, useEffect } from "react";

interface OverviewProps {
  refreshTrigger: number;
}

interface NGOStats {
  totalDonors: number;
  activeDonors: number;
  pendingRequests: number;
  totalDonations: number;
  approvedToday: number;
  donatedToday: number;
  upcomingDrives: number;
  completedDrives: number;
}

interface BloodCamp {
  id: string;
  name: string;
  location: string;
  date: string;
  time: string;
  donors: string;
  volunteers: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  progress?: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  value?: string;
  icon: string;
}

interface MonthlyGoals {
  donations: { current: number; target: number };
  camps: { current: number; target: number };
  partners: { current: number; target: number };
}

export default function Overview({ refreshTrigger }: OverviewProps) {
  const [stats, setStats] = useState<NGOStats>({
    totalDonors: 0,
    activeDonors: 0,
    pendingRequests: 0,
    totalDonations: 0,
    approvedToday: 0,
    donatedToday: 0,
    upcomingDrives: 0,
    completedDrives: 0,
  });
  const [loading, setLoading] = useState(true);

  // Monthly goals (can be fetched from API later)
  const monthlyGoals: MonthlyGoals = {
    donations: { current: 850, target: 1000 },
    camps: { current: 4, target: 5 },
    partners: { current: 12, target: 15 },
  };

  // Sample blood camps data (will be replaced with API later)
  const bloodCamps: BloodCamp[] = [
    {
      id: '1',
      name: 'Community Blood Drive',
      location: 'City Community Center, Mumbai',
      date: '15 Jan 2026',
      time: '9:00 AM - 5:00 PM',
      donors: '87/150 Donors',
      volunteers: 12,
      status: 'upcoming',
      progress: 58,
    },
    {
      id: '2',
      name: 'Corporate Donation Camp',
      location: 'Tech Park, Bangalore',
      date: '12 Jan 2026',
      time: '10:00 AM - 4:00 PM',
      donors: '200/200 Donors',
      volunteers: 18,
      status: 'ongoing',
      progress: 100,
    },
    {
      id: '3',
      name: 'University Blood Camp',
      location: 'IIT Delhi Campus',
      date: '10 Jan 2026',
      time: '8:00 AM - 6:00 PM',
      donors: '285/300 Donors',
      volunteers: 25,
      status: 'completed',
      progress: 95,
    },
  ];

  // Sample milestones data
  const milestones: Milestone[] = [
    {
      id: '1',
      title: '10,000 Donations Milestone',
      description: 'Reached 10,000 successful blood donations across all camps',
      date: '10 January 2026',
      value: '10,000',
      icon: 'trophy',
    },
    {
      id: '2',
      title: 'Partnership with Apollo Hospitals',
      description: 'Signed MOU for regular blood supply to Apollo chain',
      date: '8 January 2026',
      icon: 'handshake',
    },
    {
      id: '3',
      title: 'University Camp Success',
      description: 'IIT Delhi camp collected 285 units in a single day',
      date: '5 January 2026',
      value: '285 units',
      icon: 'calendar',
    },
  ];

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/ngo/stats', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-orange-100 text-orange-700';
      case 'ongoing': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NGO Dashboard</h1>
          <p className="text-gray-600">Manage camps, volunteers, and track your impact</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reports
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* Monthly Goals Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">January 2026 Goals</h2>
            <p className="text-sm text-gray-600">Track your monthly targets</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Donations Goal */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold text-gray-900">{monthlyGoals.donations.current}</span>
              <span className="text-lg text-gray-500">/{monthlyGoals.donations.target}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Donations</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all"
                style={{ width: `${getProgressPercentage(monthlyGoals.donations.current, monthlyGoals.donations.target)}%` }}
              ></div>
            </div>
          </div>

          {/* Camps Goal */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold text-gray-900">{monthlyGoals.camps.current}</span>
              <span className="text-lg text-gray-500">/{monthlyGoals.camps.target}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Camps</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${getProgressPercentage(monthlyGoals.camps.current, monthlyGoals.camps.target)}%` }}
              ></div>
            </div>
          </div>

          {/* New Partners Goal */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold text-gray-900">{monthlyGoals.partners.current}</span>
              <span className="text-lg text-gray-500">/{monthlyGoals.partners.target}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">New Partners</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${getProgressPercentage(monthlyGoals.partners.current, monthlyGoals.partners.target)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Donors Reached */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              18.5%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">12,450</p>
          <p className="text-sm font-medium text-gray-900 mb-1">Total Donors Reached</p>
          <p className="text-xs text-gray-500">Lifetime donor registrations</p>
        </div>

        {/* Lives Saved */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              12.3%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">8,320</p>
          <p className="text-sm font-medium text-gray-900 mb-1">Lives Saved</p>
          <p className="text-xs text-gray-500">Through blood donations</p>
        </div>

        {/* Partner Hospitals */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              5%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">45</p>
          <p className="text-sm font-medium text-gray-900 mb-1">Partner Hospitals</p>
          <p className="text-xs text-gray-500">Active partnerships</p>
        </div>

        {/* Districts Covered */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              3%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">28</p>
          <p className="text-sm font-medium text-gray-900 mb-1">Districts Covered</p>
          <p className="text-xs text-gray-500">Across Maharashtra</p>
        </div>
      </div>

      {/* Blood Donation Camps and Impact Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Blood Donation Camps */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Blood Donation Camps</h2>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Camp
            </button>
          </div>

          <div className="space-y-4">
            {bloodCamps.map((camp) => (
              <div key={camp.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{camp.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {camp.location}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(camp.status)}`}>
                      {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">{camp.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{camp.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-gray-700">{camp.donors}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-gray-700">{camp.volunteers} Volunteers</span>
                  </div>
                </div>

                {camp.progress !== undefined && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Registration Progress</span>
                      <span className="font-semibold">{camp.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all"
                        style={{ width: `${camp.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Impact Timeline */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Impact Timeline</h2>
          
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    milestone.icon === 'trophy' ? 'bg-yellow-100' :
                    milestone.icon === 'handshake' ? 'bg-red-100' :
                    'bg-green-100'
                  }`}>
                    {milestone.icon === 'trophy' && (
                      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    )}
                    {milestone.icon === 'handshake' && (
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                      </svg>
                    )}
                    {milestone.icon === 'calendar' && (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                    {milestone.value && (
                      <p className={`text-lg font-bold mb-1 ${
                        milestone.icon === 'trophy' ? 'text-yellow-600' :
                        milestone.icon === 'handshake' ? 'text-red-600' :
                        'text-green-600'
                      }`}>
                        {milestone.value}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                    <p className="text-xs text-gray-500">{milestone.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
