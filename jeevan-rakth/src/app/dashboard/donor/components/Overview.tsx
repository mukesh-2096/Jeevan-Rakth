"use client";
import { useState, useEffect } from "react";

interface OverviewProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

interface Registration {
  _id: string;
  campName?: string;
  campDate?: string;
  location?: string;
  status: 'registered' | 'accepted' | 'donated' | 'requested' | 'approved';
  registeredAt?: string;
  createdAt?: string;
  fullName?: string;
  bloodGroup?: string;
}

export default function Overview({ user }: OverviewProps) {
  const [profileData, setProfileData] = useState<{
    dateOfBirth: string;
    weight: string;
    bloodGroup: string;
  }>({
    dateOfBirth: '',
    weight: '',
    bloodGroup: '',
  });
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile data and registrations
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const profileRes = await fetch('/api/user/profile', {
          cache: 'no-store',
        });
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfileData({
            dateOfBirth: data.user.dateOfBirth || '',
            weight: data.user.weight || '',
            bloodGroup: data.user.bloodGroup || '',
          });
        }

        // Fetch both types of registrations
        const allRegistrations: Registration[] = [];

        // 1. Fetch camp registrations from campdetails
        console.log('Fetching camp registrations...');
        const campRegRes = await fetch('/api/donor/camp-registrations', {
          cache: 'no-store',
        });
        console.log('Camp registration API response status:', campRegRes.status);
        
        if (campRegRes.ok) {
          const data = await campRegRes.json();
          console.log('Camp registration data received:', data);
          const campRegs = data.registrations || [];
          console.log('Camp registrations:', campRegs.length, 'items');
          allRegistrations.push(...campRegs);
        }

        // 2. Fetch profile registrations
        console.log('Fetching profile registrations...');
        const profileRegRes = await fetch('/api/donor/registration', {
          cache: 'no-store',
        });
        console.log('Profile registration API response status:', profileRegRes.status);

        if (profileRegRes.ok) {
          const data = await profileRegRes.json();
          console.log('Profile registration data received:', data);
          const profileRegs = (data.registrations || []).map((reg: any) => ({
            _id: reg._id,
            campName: reg.fullName || 'Blood Donation Registration',
            campDate: reg.createdAt,
            location: reg.city ? `${reg.city}, ${reg.state}` : 'Not specified',
            status: reg.status === 'requested' ? 'registered' : (reg.status === 'approved' ? 'accepted' : reg.status),
            registeredAt: reg.createdAt,
            createdAt: reg.createdAt,
          }));
          console.log('Profile registrations:', profileRegs.length, 'items');
          allRegistrations.push(...profileRegs);
        }

        console.log('Total registrations:', allRegistrations.length);
        setRegistrations(allRegistrations);
        
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate age from date of birth
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

  // Calculate eligibility based on age and weight
  const calculateEligibility = () => {
    const age = calculateAge(profileData.dateOfBirth);
    const weight = parseFloat(profileData.weight);

    // Check age: must be 18 or older (not less than 19 means >= 18 is ok, but user said < 19, so we need >= 19)
    // Actually user said "less than 19" should be not eligible, so age must be >= 19
    const isAgeEligible = age >= 19;
    
    // Check weight: must be at least 50kg for blood donation
    const isWeightEligible = !isNaN(weight) && weight >= 50;

    const reasons = [];
    if (!isAgeEligible && age > 0) reasons.push('Age must be 19 or above');
    if (!isWeightEligible && weight > 0) reasons.push('Weight must be at least 50kg');
    if (!profileData.dateOfBirth) reasons.push('Date of birth not provided');
    if (!profileData.weight) reasons.push('Weight not provided');

    return {
      eligible: isAgeEligible && isWeightEligible && profileData.dateOfBirth && profileData.weight,
      reasons,
      age,
      weight,
    };
  };

  const eligibility = calculateEligibility();

  // Calculate statistics from registrations
  const totalDonations = registrations.filter(r => r.status === 'donated').length;
  // Count upcoming donations: all accepted/approved registrations
  const upcomingDonations = registrations.filter(r => r.status === 'accepted').length;

  // Get recent activity (last 5 registrations)
  const recentActivity = [...registrations]
    .sort((a, b) => new Date(b.registeredAt || 0).getTime() - new Date(a.registeredAt || 0).getTime())
    .slice(0, 5);

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'donated':
        return 'text-green-600 bg-green-100';
      case 'accepted':
      case 'approved':
        return 'text-yellow-600 bg-yellow-100';
      case 'registered':
      case 'requested':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'donated':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'accepted':
      case 'approved':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'registered':
      case 'requested':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'Donor'}!</h3>
        <p className="text-gray-600">Here&apos;s what&apos;s happening with your blood donation journey.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Total Donations</h4>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalDonations}</p>
          <p className="text-sm text-gray-500 mt-1">Lives saved: {totalDonations * 3}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Upcoming Donations</h4>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{upcomingDonations}</p>
          <p className="text-sm text-gray-500 mt-1">{upcomingDonations === 0 ? 'No scheduled donations' : `${upcomingDonations} upcoming`}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Eligibility Status</h4>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              eligibility.eligible ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {eligibility.eligible ? (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
          {loading ? (
            <p className="text-xl font-bold text-gray-400">Loading...</p>
          ) : (
            <>
              <p className={`text-3xl font-bold ${eligibility.eligible ? 'text-green-600' : 'text-red-600'}`}>
                {eligibility.eligible ? 'Eligible' : 'Not Eligible'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {eligibility.eligible ? 'Ready to donate' : eligibility.reasons[0] || 'Complete your profile'}
              </p>
              {!eligibility.eligible && eligibility.reasons.length > 0 && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-semibold text-red-800 mb-1">Reasons:</p>
                  <ul className="text-xs text-red-700 space-y-1">
                    {eligibility.reasons.map((reason, index) => (
                      <li key={index}>• {reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Loading activity...</p>
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition">
                {/* Status Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(activity.status)}`}>
                  {getStatusIcon(activity.status)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 text-base mb-1">{activity.campName || 'Registration'}</h5>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{activity.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        {activity.campDate && (
                          <>
                            <div className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Camp: {formatDate(activity.campDate)}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                          </>
                        )}
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Registered: {formatDate(activity.registeredAt || activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
