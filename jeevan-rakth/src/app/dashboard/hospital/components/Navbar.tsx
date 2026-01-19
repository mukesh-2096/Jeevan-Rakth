"use client";
import { useState, useRef, useEffect } from "react";

interface PendingRegistration {
  id: string;
  name: string;
  bloodType: string;
  location: string;
  submittedAt: string;
}

interface NavbarProps {
  activeTab: string;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  pendingRegistrations?: PendingRegistration[];
  onNotificationClick?: () => void;
}

export default function Navbar({ activeTab, user, pendingRegistrations = [], onNotificationClick }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    }

    if (showNotificationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotificationDropdown]);

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search donors, blood groups, hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Notification Icon */}
        <div className="ml-6 relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {pendingRegistrations.length > 0 && (
              <span className="absolute top-0 right-0 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                {pendingRegistrations.length > 99 ? '99+' : pendingRegistrations.length}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotificationDropdown && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  {pendingRegistrations.length > 0 && (
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      {pendingRegistrations.length} new
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {pendingRegistrations.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-gray-500 text-sm">No new notifications</p>
                  </div>
                ) : (
                  <>
                    {pendingRegistrations.map((registration) => (
                      <div
                        key={registration.id}
                        className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition"
                        onClick={() => {
                          setShowNotificationDropdown(false);
                          onNotificationClick?.();
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                            {registration.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              New donor registration
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-semibold">{registration.name}</span> ({registration.bloodType})
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{registration.location}</span>
                              <span>•</span>
                              <span>{registration.submittedAt}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {pendingRegistrations.length > 0 && (
                <div className="p-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowNotificationDropdown(false);
                      onNotificationClick?.();
                    }}
                    className="w-full text-center text-sm font-medium text-red-600 hover:text-red-700 py-2"
                  >
                    View all registrations →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
