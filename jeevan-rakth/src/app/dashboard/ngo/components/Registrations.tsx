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

interface DonorRow {
  id: number;
  donorName: string;
  email: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number;
  city: string;
  state: string;
  district: string;
  pincode: string;
}

interface Camp {
  _id: string;
  campName: string;
  organizer: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  date: string;
  time: string;
  status: string;
}

export default function Registrations() {
  const [registrations, setRegistrations] = useState<DonorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'registered' | 'accepted' | 'donated'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [camps, setCamps] = useState<Camp[]>([]);
  const [selectedCamp, setSelectedCamp] = useState<string>('');

  const [donorRows, setDonorRows] = useState<DonorRow[]>([
    {
      id: 1,
      donorName: '',
      email: '',
      bloodType: 'O+',
      phone: '',
      age: 18,
      gender: 'Male',
      weight: 50,
      city: '',
      state: '',
      district: '',
      pincode: '',
    }
  ]);

  useEffect(() => {
    fetchRegistrations();
    fetchCamps();
  }, [filter]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const statusFilter = filter !== 'all' ? `status=${filter}` : '';
      const response = await fetch(`/api/ngo/donor-registrations?${statusFilter}`);
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.donors || []);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCamps = async () => {
    try {
      const response = await fetch('/api/ngo/camps');
      if (response.ok) {
        const data = await response.json();
        setCamps(data.camps || []);
      }
    } catch (error) {
      console.error('Error fetching camps:', error);
    }
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleAddRow = () => {
    const newId = Math.max(...donorRows.map(r => r.id), 0) + 1;
    setDonorRows([...donorRows, {
      id: newId,
      donorName: '',
      email: '',
      bloodType: 'O+',
      phone: '',
      age: 18,
      gender: 'Male',
      weight: 50,
      city: '',
      state: '',
      district: '',
      pincode: '',
    }]);
  };

  const handleRemoveRow = (id: number) => {
    if (donorRows.length > 1) {
      setDonorRows(donorRows.filter(row => row.id !== id));
    }
  };

  const handleRowChange = (id: number, field: keyof DonorRow, value: any) => {
    setDonorRows(donorRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleSubmitAll = async () => {
    // Validate camp selection
    if (!selectedCamp) {
      showToast('error', 'Please select a camp first');
      return;
    }

    // Validate all rows
    const invalidRows = donorRows.filter(row => 
      !row.donorName || !row.email || !row.phone || !row.city || !row.state || !row.district
    );

    if (invalidRows.length > 0) {
      showToast('error', 'Please fill in all required fields for all donors');
      return;
    }

    try {
      let successCount = 0;
      let failCount = 0;

      for (const row of donorRows) {
        try {
          const response = await fetch('/api/donor/registration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              campId: selectedCamp,
              donorName: row.donorName,
              email: row.email,
              bloodType: row.bloodType,
              contactDetails: {
                phone: row.phone,
              },
              personalInfo: {
                age: row.age,
                gender: row.gender,
                weight: row.weight,
              },
              location: {
                city: row.city,
                state: row.state,
                district: row.district,
                pincode: row.pincode || undefined,
              },
              availability: {
                preferredDays: [],
                preferredTimeSlots: [],
              },
              status: 'registered',
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }

      if (successCount > 0) {
        showToast('success', `${successCount} registration(s) added successfully${failCount > 0 ? `, ${failCount} failed` : ''}`);
        setShowAddForm(false);
        setSelectedCamp('');
        // Reset to single empty row
        setDonorRows([{
          id: 1,
          donorName: '',
          email: '',
          bloodType: 'O+',
          phone: '',
          age: 18,
          gender: 'Male',
          weight: 50,
          city: '',
          state: '',
          district: '',
          pincode: '',
        }]);
        fetchRegistrations();
      } else {
        showToast('error', 'Failed to add registrations');
      }
    } catch (error) {
      showToast('error', 'An error occurred while adding registrations');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-yellow-100 text-yellow-800';
      case 'donated': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = reg.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Donor Registrations</h2>
          <p className="text-gray-600">Manage and review donor registration applications</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Registration
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or blood type..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
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
                ({registrations.filter(r => status === 'all' || r.status === status).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredRegistrations.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">No registrations found</p>
            <p className="text-gray-400 text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'No donor registrations available yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 font-semibold">
                            {reg.donorName?.charAt(0).toUpperCase() || 'D'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{reg.donorName || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{reg.email || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-red-100 text-red-800">
                        {reg.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{reg.location?.city || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{reg.location?.state || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reg.contactDetails?.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusColor(reg.status)}`}>
                        {capitalize(reg.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(reg.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-sm text-gray-500">View in Donor Management</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">About Registrations</h4>
            <p className="text-sm text-blue-700">
              This page shows all donor registrations for your blood camps. Use the "Add Registration" button to register new donors for specific camps. 
              To manage donor status (accept/mark as donated), go to the Donor Management page.
            </p>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddForm(false)}></div>
            <div className="relative bg-white rounded-lg max-w-[95vw] w-full my-8 shadow-xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg z-10">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Add Donor Registrations</h3>
                    <p className="text-sm text-gray-600">Fill in donor details like an Excel sheet - add multiple rows</p>
                  </div>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                    type="button"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Camp Selector */}
              <div className="px-6 pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Blood Camp <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCamp}
                  onChange={(e) => setSelectedCamp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">-- Select a Camp --</option>
                  {camps.map(camp => (
                    <option key={camp._id} value={camp._id}>
                      {camp.campName} - {camp.location.city} ({new Date(camp.date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                {camps.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">No camps available. Please create a camp first.</p>
                )}
              </div>
            </div>

              <div className="p-6 max-h-[calc(100vh-200px)] overflow-auto">
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[40px]">#</th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[150px]">
                          Name <span className="text-red-500">*</span>
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[180px]">
                          Email <span className="text-red-500">*</span>
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[100px]">
                          Blood Type <span className="text-red-500">*</span>
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[130px]">
                          Phone <span className="text-red-500">*</span>
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[70px]">
                          Age <span className="text-red-500">*</span>
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[100px]">
                          Gender <span className="text-red-500">*</span>
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[80px]">
                          Weight (kg) <span className="text-red-500">*</span>
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[120px]">
                          City <span className="text-red-500">*</span>
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[120px]">
                          District <span className="text-red-500">*</span>
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[120px]">
                          State <span className="text-red-500">*</span>
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[100px]">
                          Pincode
                        </th>
                        <th className="border border-gray-300 px-2 py-2 text-xs font-semibold text-gray-700 min-w-[80px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {donorRows.map((row, index) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1 text-center text-sm text-gray-600">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <input
                              type="text"
                              value={row.donorName}
                              onChange={(e) => handleRowChange(row.id, 'donorName', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                              placeholder="Full Name"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <input
                              type="email"
                              value={row.email}
                              onChange={(e) => handleRowChange(row.id, 'email', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                              placeholder="email@example.com"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <select
                              value={row.bloodType}
                              onChange={(e) => handleRowChange(row.id, 'bloodType', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                            >
                              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <input
                              type="tel"
                              value={row.phone}
                              onChange={(e) => handleRowChange(row.id, 'phone', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                              placeholder="9876543210"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <input
                              type="number"
                              min="18"
                              max="65"
                              value={row.age}
                              onChange={(e) => handleRowChange(row.id, 'age', parseInt(e.target.value) || 18)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <select
                              value={row.gender}
                              onChange={(e) => handleRowChange(row.id, 'gender', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <input
                              type="number"
                              min="45"
                              value={row.weight}
                              onChange={(e) => handleRowChange(row.id, 'weight', parseInt(e.target.value) || 50)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <input
                              type="text"
                              value={row.city}
                              onChange={(e) => handleRowChange(row.id, 'city', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                              placeholder="City"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <input
                              type="text"
                              value={row.district}
                              onChange={(e) => handleRowChange(row.id, 'district', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                              placeholder="District"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <input
                              type="text"
                              value={row.state}
                              onChange={(e) => handleRowChange(row.id, 'state', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                              placeholder="State"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1">
                            <input
                              type="text"
                              value={row.pincode}
                              onChange={(e) => handleRowChange(row.id, 'pincode', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-red-500 text-sm"
                              placeholder="123456"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-1 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(row.id)}
                              disabled={donorRows.length === 1}
                              className={`text-red-600 hover:text-red-900 p-1 ${donorRows.length === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                              title="Remove row"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Row
                  </button>
                  <div className="text-sm text-gray-600">
                    Total Donors: <span className="font-semibold">{donorRows.length}</span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Fields marked with <span className="text-red-500">*</span> are required. Fill all fields before submitting.
                  </p>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitAll}
                  className="px-8 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Submit All ({donorRows.length} {donorRows.length === 1 ? 'Donor' : 'Donors'})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
