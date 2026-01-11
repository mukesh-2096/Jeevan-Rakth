"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Overview from "./components/Overview";
import BloodInventory from "./components/BloodInventory";
import DonorManagement from "./components/DonorManagement";import EmergencyRequests from './components/EmergencyRequests';
export default function HospitalDashboard() {
  const { user, loading } = useAuth({ requiredRole: 'hospital' });
  
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hospitalActiveTab') || 'overview';
    }
    return 'overview';
  });

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const hasSession = sessionStorage.getItem('dashboardVisited');
      if (!hasSession) {
        setActiveTab('overview');
        localStorage.setItem('hospitalActiveTab', 'overview');
        sessionStorage.setItem('dashboardVisited', 'true');
      }
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hospitalActiveTab', activeTab);
    }
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      <div className="flex-1 flex flex-col ml-64 max-w-full overflow-x-hidden">
        <Navbar activeTab={activeTab} user={user} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden max-w-full">
          {activeTab === "overview" && <Overview user={user} />}
          {activeTab === "blood-inventory" && <BloodInventory user={user} />}
          {activeTab === "donor-management" && <DonorManagement user={user} />}
          {activeTab === "emergency-requests" && <EmergencyRequests user={user} />}
          {activeTab === "nearby-centers" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900">Nearby Centers</h1>
              <p className="text-gray-600 mt-2">View and connect with nearby blood centers</p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Configure your hospital dashboard preferences</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
