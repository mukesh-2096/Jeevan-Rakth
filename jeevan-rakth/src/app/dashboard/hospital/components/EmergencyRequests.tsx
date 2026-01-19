"use client";
import { useState } from "react";

interface EmergencyRequestsProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

type Request = {
  id: number;
  hospital: string;
  doctor: string;
  bloodType: string;
  unitsNeeded: number;
  location: string;
  locationFull: string;
  requested: string;
  reason: string;
  phone: string;
  priority: string;
  status: string;
  priorityColor: string;
  statusColor: string;
};

export default function EmergencyRequests({ user }: EmergencyRequestsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFulfillModal, setShowFulfillModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [newRequest, setNewRequest] = useState({
    bloodType: 'A+',
    unitsNeeded: 1,
    reason: '',
    priority: 'Medium',
    doctor: '',
    phone: '',
    location: '',
  });
  const [requests, setRequests] = useState<Request[]>([
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
  ]);

  // Filtering
  let filteredRequests = requests;

  if (searchQuery) {
    filteredRequests = filteredRequests.filter(req =>
      req.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.bloodType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.locationFull.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterPriority !== 'all') {
    filteredRequests = filteredRequests.filter(req => req.priority === filterPriority);
  }

  if (filterStatus !== 'all') {
    filteredRequests = filteredRequests.filter(req => req.status === filterStatus);
  }

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const fulfilledToday = requests.filter(r => r.status === 'Fulfilled').length;
  const criticalCount = requests.filter(r => r.priority === 'Critical' && r.status === 'Pending').length;

  const handleFulfillRequest = () => {
    if (selectedRequest) {
      setRequests(requests.map(req =>
        req.id === selectedRequest.id
          ? { ...req, status: 'Fulfilled', statusColor: 'bg-green-100 text-green-700' }
          : req
      ));
      setShowFulfillModal(false);
      setSelectedRequest(null);
    }
  };

  const handleCancelRequest = (id: number) => {
    setRequests(requests.map(req =>
      req.id === id
        ? { ...req, status: 'Cancelled', statusColor: 'bg-gray-100 text-gray-700' }
        : req
    ));
  };

  const handleContactHospital = (phone: string) => {
    // In a real app, this would initiate a call or open a communication modal
    window.location.href = `tel:${phone}`;
  };

  const handleCreateRequest = () => {
    const priorityColors: { [key: string]: string } = {
      'Critical': 'bg-red-100 text-red-700',
      'High': 'bg-orange-100 text-orange-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
    };

    const newReq: Request = {
      id: requests.length + 1,
      hospital: user?.name || 'Your Hospital',
      doctor: newRequest.doctor,
      bloodType: newRequest.bloodType,
      unitsNeeded: newRequest.unitsNeeded,
      location: '0 km',
      locationFull: newRequest.location,
      requested: 'Just now',
      reason: newRequest.reason,
      phone: newRequest.phone,
      priority: newRequest.priority,
      status: 'Pending',
      priorityColor: priorityColors[newRequest.priority],
      statusColor: 'bg-blue-100 text-blue-700'
    };

    setRequests([newReq, ...requests]);
    setShowCreateModal(false);
    setNewRequest({
      bloodType: 'A+',
      unitsNeeded: 1,
      reason: '',
      priority: 'Medium',
      doctor: '',
      phone: '',
      location: '',
    });
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-x-hidden box-border">
      {/* Header */}
      <div className="mb-6 w-full max-w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Emergency Requests</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage urgent blood requirement requests in real time</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 font-medium whitespace-nowrap self-start sm:self-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Request
        </button>
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

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 w-full max-w-full overflow-hidden">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex-1 relative min-w-0 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by hospital, blood type, doctor, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Priority:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterPriority('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filterPriority === 'all' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterPriority('Critical')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filterPriority === 'Critical' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setFilterPriority('High')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filterPriority === 'High' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  High
                </button>
                <button
                  onClick={() => setFilterPriority('Medium')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filterPriority === 'Medium' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Medium
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
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
                  onClick={() => setFilterStatus('Pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filterStatus === 'Pending' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus('Fulfilled')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filterStatus === 'Fulfilled' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Fulfilled
                </button>
              </div>
            </div>

            <div className="sm:ml-auto text-sm text-gray-600 flex items-center">
              Showing {filteredRequests.length} of {requests.length} requests
            </div>
          </div>
        </div>
      </div>

      {/* All Requests Section */}
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">All Requests</h2>
      </div>

      {/* Requests List */}
      <div className="space-y-4 w-full max-w-full">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 text-lg">No requests found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
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
                <>
                  <button 
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowFulfillModal(true);
                    }}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer font-medium"
                  >
                    Fulfill Request
                  </button>
                  <button 
                    onClick={() => handleCancelRequest(request.id)}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer font-medium"
                  >
                    Cancel Request
                  </button>
                </>
              )}
              <button 
                onClick={() => handleContactHospital(request.phone)}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer font-medium"
              >
                Contact Hospital
              </button>
            </div>
          </div>
        ))
        )}
      </div>

      {/* Fulfill Request Modal */}
      {showFulfillModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Fulfill Request</h2>
              <button 
                onClick={() => {
                  setShowFulfillModal(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{selectedRequest.hospital}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium text-gray-900">{selectedRequest.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type:</span>
                    <span className="font-bold text-red-600">{selectedRequest.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Units Needed:</span>
                    <span className="font-medium text-gray-900">{selectedRequest.unitsNeeded} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{selectedRequest.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${selectedRequest.priorityColor}`}>
                      {selectedRequest.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 mb-1">Confirm Fulfillment</p>
                    <p className="text-xs text-yellow-700">
                      Please ensure you have {selectedRequest.unitsNeeded} units of {selectedRequest.bloodType} blood available before confirming.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowFulfillModal(false);
                  setSelectedRequest(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleFulfillRequest}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Confirm Fulfillment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Emergency Request</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type *</label>
                  <select
                    value={newRequest.bloodType}
                    onChange={(e) => setNewRequest({ ...newRequest, bloodType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Units Needed *</label>
                  <input
                    type="number"
                    min="1"
                    value={newRequest.unitsNeeded}
                    onChange={(e) => setNewRequest({ ...newRequest, unitsNeeded: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    value={newRequest.doctor}
                    onChange={(e) => setNewRequest({ ...newRequest, doctor: e.target.value })}
                    placeholder="Dr. John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    value={newRequest.phone}
                    onChange={(e) => setNewRequest({ ...newRequest, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={newRequest.location}
                  onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
                  placeholder="City, State"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                <select
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Request *</label>
                <textarea
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                  placeholder="Describe the emergency situation..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                disabled={!newRequest.doctor || !newRequest.phone || !newRequest.location || !newRequest.reason}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
