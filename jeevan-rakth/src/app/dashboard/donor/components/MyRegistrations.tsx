"use client";
import { useState } from "react";

interface MyRegistrationsProps {
  setActiveTab: (tab: string) => void;
}

export default function MyRegistrations({ setActiveTab }: MyRegistrationsProps) {
  const [hasRegistered, setHasRegistered] = useState(false); // TODO: Fetch from API
  const [registrations, setRegistrations] = useState<any[]>([]); // TODO: Fetch from API

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">My Registrations</h3>
        {hasRegistered && (
          <button
            onClick={() => setActiveTab('register')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium cursor-pointer"
          >
            + New Registration
          </button>
        )}
      </div>

      {!hasRegistered && registrations.length === 0 ? (
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
          {registrations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">No registrations yet. Click "New Registration" to start.</p>
            </div>
          ) : (
            registrations.map((reg) => (
              <div key={reg.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{reg.fullName}</h4>
                    <p className="text-sm text-gray-600">Blood Group: {reg.bloodGroup}</p>
                    <p className="text-sm text-gray-600">Location: {reg.city}, {reg.state}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                    reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {reg.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

