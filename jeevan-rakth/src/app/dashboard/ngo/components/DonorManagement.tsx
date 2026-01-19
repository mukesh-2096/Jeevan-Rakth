"use client";
import { useState, useEffect } from "react";

interface DonorRegistration {
  _id: string;
  campId: string;
  donorName: string;
  email: string;
  bloodType: string;
  contactDetails: {
    phone: string;
  };
  personalInfo: {
    age: number;
    gender: string;
    weight: number;
  };
  location: {
    city: string;
    state: string;
    district: string;
    pincode?: string;
  };
  status: 'registered' | 'accepted' | 'donated';
  createdAt: string;
  updatedAt: string;
}

interface DonorManagementProps {
  onApprove: () => void;
  onReject: () => void;
  onRefreshOverview: () => void;
}

export default function DonorManagement({ onApprove, onReject, onRefreshOverview }: DonorManagementProps) {
  const [donors, setDonors] = useState<DonorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'registered' | 'accepted' | 'donated'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [tempStatus, setTempStatus] = useState<'registered' | 'accepted' | 'donated'>('registered');

  useEffect(() => {
    fetchDonors();
  }, [filter]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const statusFilter = filter !== 'all' ? `status=${filter}` : '';
      const response = await fetch(`/api/ngo/donor-registrations?${statusFilter}`);
      if (response.ok) {
        const data = await response.json();
        setDonors(data.donors || []);
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleUpdateStatus = async (id: string, newStatus: 'registered' | 'accepted' | 'donated') => {
    try {
      const response = await fetch(`/api/ngo/donor-registrations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        showToast('success', `Status updated to ${newStatus}`);
        fetchDonors();
        onRefreshOverview();
      } else {
        showToast('error', 'Failed to update status');
      }
    } catch (error) {
      showToast('error', 'An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this donor record?')) return;
    
    try {
      const response = await fetch(`/api/ngo/donor-registrations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('success', 'Donor record deleted');
        fetchDonors();
        onRefreshOverview();
      } else {
        showToast('error', 'Failed to delete donor record');
      }
    } catch (error) {
      showToast('error', 'An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-yellow-100 text-yellow-800';
      case 'donated': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleEditStatus = (donorId: string, currentStatus: 'registered' | 'accepted' | 'donated') => {
    setEditingStatus(donorId);
    setTempStatus(currentStatus);
  };

  const handleSaveStatus = async (donorId: string) => {
    await handleUpdateStatus(donorId, tempStatus);
    setEditingStatus(null);
  };

  const handleCancelEdit = () => {
    setEditingStatus(null);
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
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {message.text}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Donor Management</h2>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['all', 'registered', 'accepted', 'donated'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === status
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {capitalize(status === 'all' ? 'all' : status)}
            <span className="ml-2 text-sm">
              ({donors.filter(d => status === 'all' || d.status === status).length})
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {donors.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">No donor records found</p>
            <p className="text-gray-400 text-sm">Donors who participated in camps will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[calc(100vh-320px)] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Donor
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donors.map((donor) => (
                <tr key={donor._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-12 w-12 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {donor.donorName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{donor.donorName}</div>
                        <div className="text-xs text-blue-600">{donor._id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{donor.bloodType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {donor.contactDetails.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {donor.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="text-sm text-gray-900">
                        {donor.location.city}, {donor.location.state}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingStatus === donor._id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={tempStatus}
                          onChange={(e) => setTempStatus(e.target.value as 'registered' | 'accepted' | 'donated')}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                          <option value="registered">Registered</option>
                          <option value="accepted">Accepted</option>
                          <option value="donated">Donated</option>
                        </select>
                        <button
                          onClick={() => handleSaveStatus(donor._id)}
                          className="text-green-600 hover:text-green-900"
                          title="Save"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(donor.status)}`}>
                          {capitalize(donor.status)}
                        </span>
                        <button
                          onClick={() => handleEditStatus(donor._id, donor.status)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit status"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(donor.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(donor._id)}
                      className="text-red-600 hover:text-red-900 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
