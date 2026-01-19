"use client";
import { useState, useEffect } from "react";

interface OverviewProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  refreshTrigger?: number;
}

type DonorStats = {
  totalDonors: number;
  activeDonors: number;
  pendingRequests: number;
  totalDonations: number;
  approvedToday: number;
  donatedToday: number;
};

type RecentRequest = {
  id: string;
  name: string;
  bloodType: string;
  location: string;
  submittedAt: string;
};

type UpcomingDonation = {
  id: string;
  name: string;
  bloodType: string;
  location: string;
  status: string;
};

export default function Overview({ user, refreshTrigger = 0 }: OverviewProps) {
  const [stats, setStats] = useState<DonorStats>({
    totalDonors: 0,
    activeDonors: 0,
    pendingRequests: 0,
    totalDonations: 0,
    approvedToday: 0,
    donatedToday: 0,
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [upcomingDonations, setUpcomingDonations] = useState<UpcomingDonation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hospital/stats', {
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

  // Fetch recent requests (pending registrations)
  const fetchRecentRequests = async () => {
    try {
      const response = await fetch('/api/hospital/registrations', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        // Get the 5 most recent pending requests
        setRecentRequests(data.pendingRegistrations.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching recent requests:', error);
    }
  };

  // Fetch upcoming donations (accepted donors)
  const fetchUpcomingDonations = async () => {
    try {
      const response = await fetch('/api/hospital/donors', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter for accepted status and get first 5
        const accepted = data.donors?.filter((d: any) => d.status === 'accepted').slice(0, 5) || [];
        setUpcomingDonations(accepted.map((d: any) => ({
          id: d.id,
          name: d.name,
          bloodType: d.bloodType,
          location: d.location,
          status: d.status
        })));
      }
    } catch (error) {
      console.error('Error fetching upcoming donations:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchRecentRequests();
      fetchUpcomingDonations();
    }
  }, [user, refreshTrigger]);
  const bloodInventory = [
    { group: 'A+', units: 0, status: 'Critical', percentage: 0, color: 'red' },
    { group: 'A-', units: 0, status: 'Critical', percentage: 0, color: 'red' },
    { group: 'B+', units: 0, status: 'Critical', percentage: 0, color: 'red' },
    { group: 'B-', units: 0, status: 'Critical', percentage: 0, color: 'red' },
    { group: 'AB+', units: 0, status: 'Critical', percentage: 0, color: 'red' },
    { group: 'AB-', units: 0, status: 'Critical', percentage: 0, color: 'red' },
    { group: 'O+', units: 0, status: 'Critical', percentage: 0, color: 'red' },
    { group: 'O-', units: 0, status: 'Critical', percentage: 0, color: 'red' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Real-time insights into blood donation and inventory management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </div>
            {stats.donatedToday > 0 && (
              <span className="text-sm font-medium text-green-600">+{stats.donatedToday} today</span>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.totalDonations}</p>
          <p className="text-sm text-gray-600">Total Donations</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            {stats.approvedToday > 0 && (
              <span className="text-sm font-medium text-green-600">+{stats.approvedToday} today</span>
            )}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.activeDonors}</p>
          <p className="text-sm text-gray-600">Active Donors</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium text-yellow-600">{stats.pendingRequests > 0 ? 'Needs Review' : ''}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.pendingRequests}</p>
          <p className="text-sm text-gray-600">Pending Requests</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {stats.totalDonors > 0 ? `${Math.round((stats.activeDonors / stats.totalDonors) * 100)}%` : '0%'}
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{loading ? '...' : stats.totalDonors}</p>
          <p className="text-sm text-gray-600">Total Donors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Inventory Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Blood Inventory Status</h2>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="space-y-4">
            {bloodInventory.map((blood) => (
              <div key={blood.group}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-red-600 w-12">{blood.group}</span>
                    <div>
                      <span className="text-sm font-semibold text-gray-900">{blood.units} units</span>
                      <p className="text-xs text-gray-500">{blood.status}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{blood.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      blood.color === 'green' ? 'bg-green-500' :
                      blood.color === 'yellow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${blood.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Requests & Upcoming Donations */}
        <div className="space-y-6">
          {/* Recent Requests */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-3">
              {recentRequests.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-500 text-sm">No recent requests</p>
                </div>
              ) : recentRequests.map((request, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{request.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        Pending
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-red-600">{request.bloodType}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{request.location}</span>
                      <span className="ml-auto">{request.submittedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Donations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Donations</h2>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-3">
              {upcomingDonations.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No upcoming donations</p>
                </div>
              ) : upcomingDonations.map((donation, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{donation.name}</h3>
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        Accepted
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-red-600">{donation.bloodType}</span>
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{donation.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
