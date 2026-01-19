"use client";
import { useState, useEffect } from "react";

interface MyRegistrationsProps {
  setActiveTab: (tab: string) => void;
}

export default function MyRegistrations({ setActiveTab }: MyRegistrationsProps) {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/donor/registration');
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.registrations || []);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">My Registrations</h3>
        <button
          onClick={() => setActiveTab('register')}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium cursor-pointer flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Registration
        </button>
      </div>

      {registrations.length === 0 ? (
        // First-time donor - Encourage to donate
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            
            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Save Lives?
            </h4>
            <p className="text-gray-600 mb-6">
              You haven't registered for blood donation yet. Take the first step towards becoming a hero - register now and help save lives in your community.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h5 className="font-semibold text-blue-900 mb-2">Why Donate Blood?</h5>
              <ul className="text-left text-sm text-blue-800 space-y-1">
                <li>✓ One donation can save up to 3 lives</li>
                <li>✓ Free health screening before every donation</li>
                <li>✓ Helps reduce the risk of heart disease</li>
                <li>✓ Join a community of life-savers</li>
              </ul>
            </div>

            <button
              onClick={() => setActiveTab('register')}
              className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-lg cursor-pointer shadow-md"
            >
              Register Now
            </button>
          </div>
        </div>
      ) : (
        // Show registrations list
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{reg.fullName}</h4>
                      <p className="text-sm text-gray-500">Registered on {formatDate(reg.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    reg.status === 'active' ? 'bg-green-100 text-green-800' :
                    reg.status === 'registered' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {reg.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Blood Group</p>
                    <p className="font-semibold text-red-600 text-lg">{reg.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Weight</p>
                    <p className="font-semibold text-gray-900">{reg.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="font-semibold text-gray-900 text-sm">{reg.city}, {reg.state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Contact</p>
                    <p className="font-semibold text-gray-900 text-sm">{reg.contactMethod}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {reg.donationRadius} km radius
                    </div>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {reg.availableDays?.join(', ')}
                    </div>
                    {reg.firstDonation === 'No' && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Previous donor
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

