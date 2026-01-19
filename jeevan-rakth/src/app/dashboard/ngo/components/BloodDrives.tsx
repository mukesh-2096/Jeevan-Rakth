"use client";
import { useState, useEffect } from "react";

interface BloodCamp {
  _id: string;
  name: string;
  description?: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode?: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  targetDonors: number;
  currentDonors: number;
  volunteers: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  facilities?: string[];
  contactPerson: {
    name: string;
    phone: string;
    email?: string;
  };
  requirements?: {
    bloodGroup?: string[];
    minimumAge?: number;
    specialInstructions?: string;
  };
  progress?: number;
  createdAt: string;
}

export default function BloodDrives() {
  const [camps, setCamps] = useState<BloodCamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState<BloodCamp | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
    date: '',
    startTime: '',
    endTime: '',
    targetDonors: 100,
    volunteers: 0,
    facilities: [] as string[],
    contactPerson: {
      name: '',
      phone: '',
      email: '',
    },
    requirements: {
      bloodGroup: [] as string[],
      minimumAge: 18,
      specialInstructions: '',
    },
  });

  useEffect(() => {
    fetchCamps();
  }, [filterStatus]);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const url = filterStatus === 'all' 
        ? '/api/ngo/camps' 
        : `/api/ngo/camps?status=${filterStatus}`;
      
      const response = await fetch(url, { credentials: 'include' });
      
      if (response.ok) {
        const data = await response.json();
        setCamps(data.camps || []);
      } else {
        showMessage('error', 'Failed to load camps');
      }
    } catch (error) {
      console.error('Error fetching camps:', error);
      showMessage('error', 'Failed to load camps');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: { address: '', city: '', state: '', pincode: '' },
      date: '',
      startTime: '',
      endTime: '',
      targetDonors: 100,
      volunteers: 0,
      facilities: [],
      contactPerson: { name: '', phone: '', email: '' },
      requirements: { bloodGroup: [], minimumAge: 18, specialInstructions: '' },
    });
    setSelectedCamp(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const isEdit = showEditForm && selectedCamp;
      const url = isEdit ? `/api/ngo/camps/${selectedCamp._id}` : '/api/ngo/camps';
      const method = isEdit ? 'PATCH' : 'POST';

      console.log('Submitting camp data:', formData);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log('Response:', { status: response.status, data });

      if (response.ok) {
        showMessage('success', data.message || `Camp ${isEdit ? 'updated' : 'created'} successfully!`);
        setShowCreateForm(false);
        setShowEditForm(false);
        resetForm();
        fetchCamps();
      } else {
        const errorMsg = data.details 
          ? `Missing fields: ${Object.entries(data.details).filter(([k, v]) => !v).map(([k]) => k).join(', ')}`
          : data.error || `Failed to ${isEdit ? 'update' : 'create'} camp`;
        showMessage('error', errorMsg);
      }
    } catch (error) {
      console.error('Error submitting camp:', error);
      showMessage('error', 'An error occurred');
    }
  };

  const handleEdit = (camp: BloodCamp) => {
    setSelectedCamp(camp);
    setFormData({
      name: camp.name,
      description: camp.description || '',
      location: camp.location,
      date: camp.date.split('T')[0],
      startTime: camp.startTime,
      endTime: camp.endTime,
      targetDonors: camp.targetDonors,
      volunteers: camp.volunteers,
      facilities: camp.facilities || [],
      contactPerson: camp.contactPerson,
      requirements: camp.requirements || { bloodGroup: [], minimumAge: 18, specialInstructions: '' },
    });
    setShowEditForm(true);
  };

  const handleDelete = async (campId: string) => {
    if (!confirm('Are you sure you want to delete this camp?')) return;

    try {
      const response = await fetch(`/api/ngo/camps/${campId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Camp deleted successfully');
        fetchCamps();
      } else {
        showMessage('error', data.error || 'Failed to delete camp');
      }
    } catch (error) {
      console.error('Error deleting camp:', error);
      showMessage('error', 'Failed to delete camp');
    }
  };

  const handleUpdateStatus = async (campId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/ngo/camps/${campId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', `Camp status updated to ${newStatus}`);
        fetchCamps();
      } else {
        showMessage('error', data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showMessage('error', 'Failed to update status');
    }
  };

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const toggleBloodGroup = (group: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        bloodGroup: prev.requirements.bloodGroup.includes(group)
          ? prev.requirements.bloodGroup.filter(g => g !== group)
          : [...prev.requirements.bloodGroup, group],
      },
    }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.upcoming;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              <button onClick={() => setMessage(null)} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Blood Drives & Camps</h2>
          <p className="text-gray-600 mt-1">Organize and manage blood donation events</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Camp
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex gap-1">
        {['all', 'upcoming', 'ongoing', 'completed', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filterStatus === status
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || showEditForm) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6 rounded-t-xl flex items-center justify-between sticky top-0 z-10">
                <h3 className="text-2xl font-bold">
                  {showEditForm ? 'Edit Blood Camp' : 'Create New Blood Camp'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    resetForm();
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Camp Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Community Blood Drive 2026"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Donors <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.targetDonors}
                      onChange={(e) => setFormData({...formData, targetDonors: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Brief description of the blood donation camp..."
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date & Time
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.location.address}
                      onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Building name, street, area"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location.city}
                        onChange={(e) => setFormData({...formData, location: {...formData.location, city: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Mumbai"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.location.state}
                        onChange={(e) => setFormData({...formData, location: {...formData.location, state: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Maharashtra"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={formData.location.pincode}
                        onChange={(e) => setFormData({...formData, location: {...formData.location, pincode: e.target.value}})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="400001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Volunteers</label>
                      <input
                        type="number"
                        value={formData.volunteers}
                        onChange={(e) => setFormData({...formData, volunteers: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Contact Person
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson.name}
                      onChange={(e) => setFormData({...formData, contactPerson: {...formData.contactPerson, name: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPerson.phone}
                      onChange={(e) => setFormData({...formData, contactPerson: {...formData.contactPerson, phone: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.contactPerson.email}
                      onChange={(e) => setFormData({...formData, contactPerson: {...formData.contactPerson, email: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Facilities Available</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Refreshments', 'First Aid', 'Parking', 'AC Room', 'Wheelchair Access', 'Medical Staff', 'Emergency Care', 'Certificates'].map(facility => (
                    <label key={facility} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(facility)}
                        onChange={() => toggleFacility(facility)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Donor Requirements</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Blood Groups Needed</label>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                      <button
                        key={group}
                        type="button"
                        onClick={() => toggleBloodGroup(group)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.requirements.bloodGroup.includes(group)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {group}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Age</label>
                    <input
                      type="number"
                      value={formData.requirements.minimumAge}
                      onChange={(e) => setFormData({...formData, requirements: {...formData.requirements, minimumAge: parseInt(e.target.value)}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      min="18"
                      max="65"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                    <input
                      type="text"
                      value={formData.requirements.specialInstructions}
                      onChange={(e) => setFormData({...formData, requirements: {...formData.requirements, specialInstructions: e.target.value}})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., Bring ID proof"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4 -mx-8 -mb-8 rounded-b-xl flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setShowEditForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-lg shadow-red-500/30 font-semibold flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {showEditForm ? 'Update Camp' : 'Create Camp'}
                </button>
              </div>
            </form>
          </div>
          </div>
        </div>
      )}

      {/* Camps List */}
      {camps.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Blood Camps Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Start organizing blood donation events by creating your first camp.
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Camp
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {camps.map((camp) => (
            <div key={camp._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Camp Header */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{camp.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {camp.location.city}, {camp.location.state}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(camp.status)}`}>
                    {camp.status.charAt(0).toUpperCase() + camp.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Camp Details */}
              <div className="p-6 space-y-4">
                {/* Date & Time */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{formatDate(camp.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{camp.startTime} - {camp.endTime}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Donors: {camp.currentDonors}/{camp.targetDonors}
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      {camp.progress || Math.round((camp.currentDonors / camp.targetDonors) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all"
                      style={{ width: `${camp.progress || Math.round((camp.currentDonors / camp.targetDonors) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 py-3 border-t border-b border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{camp.volunteers}</div>
                    <div className="text-xs text-gray-600">Volunteers</div>
                  </div>
                  <div className="text-center border-l border-r border-gray-100">
                    <div className="text-2xl font-bold text-gray-900">{camp.facilities?.length || 0}</div>
                    <div className="text-xs text-gray-600">Facilities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{camp.requirements?.bloodGroup?.length || 0}</div>
                    <div className="text-xs text-gray-600">Blood Types</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{camp.contactPerson.name} - {camp.contactPerson.phone}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(camp)}
                    disabled={camp.status === 'completed' || camp.status === 'cancelled'}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Edit
                  </button>
                  
                  {camp.status === 'upcoming' && (
                    <button
                      onClick={() => handleUpdateStatus(camp._id, 'ongoing')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                      Start
                    </button>
                  )}
                  
                  {camp.status === 'ongoing' && (
                    <button
                      onClick={() => handleUpdateStatus(camp._id, 'completed')}
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium"
                    >
                      Complete
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(camp._id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
