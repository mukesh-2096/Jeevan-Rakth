"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const menuItems = [
  { id: "overview", label: "Overview" },
  { id: "nearby-hospitals", label: "Nearby Hospitals" },
  { id: "my-registrations", label: "My Registrations" },
];

export default function Navbar({ activeTab, setActiveTab, user }: NavbarProps) {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // TODO: Replace with actual notifications from API
  const notifications: { id: number; message: string; time: string; read: boolean }[] = [];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="h-16 bg-white shadow-sm flex items-center justify-between px-6">
      {/* Left side - Page title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 capitalize">
          {menuItems.find(item => item.id === activeTab)?.label || "Dashboard"}
        </h2>
      </div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification badge */}
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                    {notifications.filter(n => !n.read).length} new
                  </span>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                        !notification.read ? 'bg-red-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          !notification.read ? 'bg-red-600' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-100">
                  <button className="text-xs text-red-600 hover:text-red-700 font-medium w-full text-center cursor-pointer">
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'D'}
              </span>
            </div>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Donor'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
              <button 
                onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Profile
              </button>
              <button 
                onClick={() => { setActiveTab('my-account'); setShowProfileMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                My Account
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer border-t border-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
