"use client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Sidebar({ activeTab, setActiveTab, user }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "nearby-hospitals", label: "Nearby Hospitals", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { id: "my-registrations", label: "My Registrations", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      {/* Logo Area - Where sidebar meets navbar */}
      <div className="h-16 flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 border-b border-red-800">
        <h1 className="text-2xl font-bold text-white">JeevanRakth</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition cursor-pointer ${
              activeTab === item.id
                ? "bg-red-50 text-red-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info at Bottom */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-semibold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'D'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Donor'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium cursor-pointer"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
