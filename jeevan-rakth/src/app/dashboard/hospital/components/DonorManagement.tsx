"use client";
import { useState, useEffect } from "react";

interface DonorManagementProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  pendingRegistrations?: PendingRegistration[];
  onApproveRegistration?: (id: string) => void;
  onRejectRegistration?: (id: string) => void;
  loadingRegistrations?: boolean;
  refreshTrigger?: number;
  showToast?: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  onRefreshOverview?: () => void;
}

type Donor = {
  id: string;
  name: string;
  initials: string;
  bloodType: string;
  phone: string;
  email: string;
  location: string;
  lastDonation: string;
  totalDonations: number;
  status: string;
  donationStatus: 'approved' | 'donated';
  avatar: string;
};

type PendingRegistration = {
  id: string;
  name: string;
  bloodType: string;
  phone: string;
  email: string;
  location: string;
  age: number;
  gender: string;
  submittedAt: string;
};

export default function DonorManagement({ user, pendingRegistrations = [], onApproveRegistration, onRejectRegistration, loadingRegistrations = false, refreshTrigger = 0, showToast, onRefreshOverview }: DonorManagementProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBloodType, setFilterBloodType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [sortField, setSortField] = useState<'name' | 'bloodType' | 'totalDonations' | 'lastDonation'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddDonorModal, setShowAddDonorModal] = useState(false);
  const [newDonorForm, setNewDonorForm] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    mobileNumber: '',
    email: '',
    bloodGroup: '',
    weight: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
  });
  
  const [donorsData, setDonorsData] = useState<Donor[]>([]);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [donorStats, setDonorStats] = useState({
    total: 0,
    available: 0,
    activeThisMonth: 0,
    newRegistrations: 0
  });

  // Fetch active donors from API
  const fetchActiveDonors = async () => {
    try {
      setLoadingDonors(true);
      const response = await fetch('/api/hospital/donors', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.donors) {
        setDonorsData(data.donors);
        
        // Update stats
        if (data.stats) {
          setDonorStats({
            total: data.stats.total || 0,
            available: data.stats.available || 0,
            activeThisMonth: 0, // Can be calculated based on recent donation dates
            newRegistrations: pendingRegistrations.length
          });
        }
      } else {
        setDonorsData([]);
      }
    } catch (error) {
      console.error('Error fetching active donors:', error);
      setDonorsData([]);
    } finally {
      setLoadingDonors(false);
    }
  };

  // Fetch donors on component mount and when refresh trigger changes
  useEffect(() => {
    if (user && user.role === 'hospital') {
      fetchActiveDonors();
    }
  }, [user, refreshTrigger]);

  // Update stats when pending registrations change
  useEffect(() => {
    setDonorStats(prev => ({
      ...prev,
      newRegistrations: pendingRegistrations.length
    }));
  }, [pendingRegistrations]);

  // Filtering
  let filteredDonors = donorsData;

  if (searchQuery) {
    filteredDonors = filteredDonors.filter(donor =>
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.bloodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterBloodType !== 'all') {
    filteredDonors = filteredDonors.filter(donor => donor.bloodType === filterBloodType);
  }

  if (filterStatus !== 'all') {
    filteredDonors = filteredDonors.filter(donor => donor.status === filterStatus);
  }

  // Sorting
  const sortedDonors = [...filteredDonors].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'bloodType') {
      comparison = a.bloodType.localeCompare(b.bloodType);
    } else if (sortField === 'totalDonations') {
      comparison = a.totalDonations - b.totalDonations;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleContactDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowContactModal(true);
  };

  const handleMarkAsDonated = async (donorId: string) => {
    try {
      const response = await fetch(`/api/hospital/donors/${donorId}/donate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          donationDate: new Date().toISOString() 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast?.('error', data.error || 'Failed to mark donor as donated');
        return;
      }

      // Refresh donors list
      fetchActiveDonors();
      
      // Refresh overview stats
      onRefreshOverview?.();
      
      // Show success message
      showToast?.('success', 'Donor successfully marked as donated!');
    } catch (error) {
      console.error('Error marking as donated:', error);
      showToast?.('error', 'An error occurred while marking donor as donated');
    }
  };

  const handleAddNewDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/hospital/add-donor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newDonorForm),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast?.('error', data.error || 'Failed to add new donor');
        return;
      }

      // Reset form and close modal
      setNewDonorForm({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        mobileNumber: '',
        email: '',
        bloodGroup: '',
        weight: '',
        state: '',
        district: '',
        city: '',
        pincode: '',
      });
      setShowAddDonorModal(false);
      
      // Refresh donors list
      fetchActiveDonors();
      
      // Show success message
      showToast?.('success', 'New donor added successfully!');
    } catch (error) {
      console.error('Error adding new donor:', error);
      showToast?.('error', 'An error occurred while adding donor');
    }
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-x-hidden box-border">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 w-full max-w-full">
        <div className="min-w-0 flex-1 max-w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Donor Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage and track all registered blood donors</p>
        </div>
        <button 
          onClick={() => setShowAddDonorModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer whitespace-nowrap flex-shrink-0 w-full sm:w-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add New Donor</span>
          <span className="sm:hidden">Add Donor</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-4 text-sm font-medium transition relative ${
              activeTab === 'all'
                ? 'text-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Donors
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-4 text-sm font-medium transition relative ${
              activeTab === 'pending'
                ? 'text-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Registrations
            {pendingRegistrations.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                {pendingRegistrations.length}
              </span>
            )}
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 w-full max-w-full">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Donors</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{donorStats.total}</p>
          <p className="text-xs sm:text-sm text-gray-600">+{donorStats.newRegistrations} pending</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Available Now</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">{donorStats.available}</p>
          <p className="text-xs sm:text-sm text-gray-600">
            {donorStats.total > 0 ? Math.round((donorStats.available / donorStats.total) * 100) : 0}% of total
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Active This Month</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-600 mb-2">{donorStats.activeThisMonth}</p>
          <p className="text-xs sm:text-sm text-gray-600">Recent donations</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">New Registrations</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">{donorStats.newRegistrations}</p>
          <p className="text-xs sm:text-sm text-gray-600">Pending approval</p>
        </div>
      </div>

      {/* Search and Filters - Only show for All Donors tab */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-6 w-full max-w-full overflow-hidden">
          <div className="flex flex-col gap-4 w-full max-w-full">
            {/* Search */}
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Blood Type:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterBloodType('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                      filterBloodType === 'all' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {bloodTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterBloodType(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                        filterBloodType === type 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Status:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filterStatus === 'all' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus('Available')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filterStatus === 'Available' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Available
                  </button>
                  <button
                    onClick={() => setFilterStatus('Not Available')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                      filterStatus === 'Not Available' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Not Available
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {sortedDonors.length} of {donorsData.length} donors
            </div>
          </div>
        </div>
      )}

      {/* Pending Registrations Tab Content */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loadingRegistrations ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
              <p className="text-sm text-gray-600">Loading pending registrations...</p>
            </div>
          ) : pendingRegistrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending registrations</h3>
              <p className="text-sm text-gray-600 text-center">All donor registration requests have been processed</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">{pendingRegistrations.length}</span> pending registration{pendingRegistrations.length !== 1 ? 's' : ''} waiting for review
                </p>
              </div>
              <div className="divide-y divide-gray-200">
              {pendingRegistrations.map((registration) => (
                <div key={registration.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Donor Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold text-lg flex-shrink-0">
                          {registration.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{registration.name}</h3>
                            <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                              {registration.bloodType}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{registration.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="truncate">{registration.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{registration.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{registration.submittedAt}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>Age: {registration.age}</span>
                            <span>•</span>
                            <span>Gender: {registration.gender}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        onClick={() => onApproveRegistration?.(registration.id)}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onRejectRegistration?.(registration.id)}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* All Donors List - Mobile Card View (hidden on lg screens) */}
      {activeTab === 'all' && (
        <>
          <div className="lg:hidden space-y-4 w-full max-w-full">
            {sortedDonors.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-600 text-lg">No donors found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
              </div>
            ) : (
              sortedDonors.map((donor) => (
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
              <div className="flex items-center gap-2">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  donor.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {donor.status}
                </span>
                {donor.donationStatus === 'approved' && (
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Approved
                  </span>
                )}
                {donor.donationStatus === 'donated' && (
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    Donated
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {donor.donationStatus === 'approved' && (
                  <button 
                    onClick={() => handleMarkAsDonated(donor.id)}
                    className="text-xs font-medium text-purple-600 hover:text-purple-700 cursor-pointer px-2 py-1 border border-purple-600 rounded hover:bg-purple-50"
                  >
                    Mark as Donated
                  </button>
                )}
                <button 
                  onClick={() => handleContactDonor(donor)}
                  className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))
            )}
          </div>

          {/* Donors Table - Desktop View (hidden on mobile/tablet) */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden w-full max-w-full">
            {sortedDonors.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600 text-lg">No donors found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
        <div className="overflow-x-auto max-w-full">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  onClick={() => handleSort('name')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Donor
                    {sortField === 'name' && (
                      <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('bloodType')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Blood Type
                    {sortField === 'bloodType' && (
                      <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Donation</th>
                <th 
                  onClick={() => handleSort('totalDonations')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    Total Donations
                    {sortField === 'totalDonations' && (
                      <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedDonors.map((donor) => (
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
                    <div className="flex flex-col gap-1.5">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        donor.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {donor.status}
                      </span>
                      {donor.donationStatus === 'approved' && (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Approved
                        </span>
                      )}
                      {donor.donationStatus === 'donated' && (
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          Donated
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      {donor.donationStatus === 'approved' && (
                        <button 
                          onClick={() => handleMarkAsDonated(donor.id)}
                          className="text-xs font-medium text-purple-600 hover:text-purple-700 cursor-pointer px-3 py-1.5 border border-purple-600 rounded hover:bg-purple-50"
                        >
                          Mark as Donated
                        </button>
                      )}
                      <button 
                        onClick={() => handleContactDonor(donor)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
                      >
                        Contact
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            )}
          </div>
        </>
      )}

      {/* Contact Donor Modal */}
      {showContactModal && selectedDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Contact Donor</h2>
              <button 
                onClick={() => {
                  setShowContactModal(false);
                  setSelectedDonor(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${selectedDonor.avatar} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                  {selectedDonor.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{selectedDonor.name}</h3>
                  <p className="text-sm text-gray-600">{selectedDonor.id}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Blood Type</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                    </svg>
                    <span className="font-semibold text-gray-900">{selectedDonor.bloodType}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <a href={`tel:${selectedDonor.phone}`} className="text-sm text-blue-600 hover:underline">
                    {selectedDonor.phone}
                  </a>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a href={`mailto:${selectedDonor.email}`} className="text-sm text-blue-600 hover:underline break-all">
                    {selectedDonor.email}
                  </a>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="text-sm text-gray-900">{selectedDonor.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Donation</p>
                    <p className="text-sm font-medium text-gray-900">{selectedDonor.lastDonation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Donations</p>
                    <p className="text-sm font-medium text-gray-900">{selectedDonor.totalDonations} times</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    selectedDonor.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedDonor.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <a
                href={`tel:${selectedDonor.phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
              <a
                href={`mailto:${selectedDonor.email}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add New Donor Modal */}
      {showAddDonorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Donor</h2>
              <button 
                onClick={() => {
                  setShowAddDonorModal(false);
                  setNewDonorForm({
                    fullName: '',
                    dateOfBirth: '',
                    gender: '',
                    mobileNumber: '',
                    email: '',
                    bloodGroup: '',
                    weight: '',
                    state: '',
                    district: '',
                    city: '',
                    pincode: '',
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddNewDonor} className="space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newDonorForm.fullName}
                      onChange={(e) => setNewDonorForm({...newDonorForm, fullName: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newDonorForm.dateOfBirth}
                      onChange={(e) => setNewDonorForm({...newDonorForm, dateOfBirth: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newDonorForm.gender}
                      onChange={(e) => setNewDonorForm({...newDonorForm, gender: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={newDonorForm.mobileNumber}
                      onChange={(e) => setNewDonorForm({...newDonorForm, mobileNumber: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="10 digit mobile number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={newDonorForm.email}
                      onChange={(e) => setNewDonorForm({...newDonorForm, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
              </div>

              {/* Blood & Health Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood & Health Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newDonorForm.bloodGroup}
                      onChange={(e) => setNewDonorForm({...newDonorForm, bloodGroup: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="45"
                      value={newDonorForm.weight}
                      onChange={(e) => setNewDonorForm({...newDonorForm, weight: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Minimum 45 kg"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newDonorForm.state}
                      onChange={(e) => setNewDonorForm({...newDonorForm, state: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter state"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newDonorForm.district}
                      onChange={(e) => setNewDonorForm({...newDonorForm, district: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter district"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newDonorForm.city}
                      onChange={(e) => setNewDonorForm({...newDonorForm, city: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6}"
                      value={newDonorForm.pincode}
                      onChange={(e) => setNewDonorForm({...newDonorForm, pincode: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="6 digit pincode"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDonorModal(false);
                    setNewDonorForm({
                      fullName: '',
                      dateOfBirth: '',
                      gender: '',
                      mobileNumber: '',
                      email: '',
                      bloodGroup: '',
                      weight: '',
                      state: '',
                      district: '',
                      city: '',
                      pincode: '',
                    });
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Add Donor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
