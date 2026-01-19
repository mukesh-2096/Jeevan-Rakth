"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Overview from "./components/Overview";
import DonorManagement from "./components/DonorManagement";
import BloodDrives from "./components/BloodDrives";
import Registrations from "./components/Registrations";
import CampManagement from "./components/CampManagement";
import ProfileSettings from "./components/ProfileSettings";

export default function NGODashboard() {
  const { user, loading } = useAuth({ requiredRole: 'ngo' });
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshOverview, setRefreshOverview] = useState(0);

  // Show loading state while checking authentication
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

  // If no user, the useAuth hook will redirect automatically
  if (!user) {
    return null;
  }

  const handleApproveRegistration = () => {
    setRefreshOverview(prev => prev + 1);
  };

  const handleRejectRegistration = () => {
    setRefreshOverview(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name || 'NGO User'} userEmail={user.email} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-8">
          {activeTab === 'overview' && <Overview refreshTrigger={refreshOverview} />}
          {activeTab === 'donors' && (
            <DonorManagement 
              onApprove={handleApproveRegistration}
              onReject={handleRejectRegistration}
              onRefreshOverview={() => setRefreshOverview(prev => prev + 1)}
            />
          )}
          {activeTab === 'blood-drives' && <BloodDrives />}
          {activeTab === 'registrations' && <Registrations />}
          {activeTab === 'camp-management' && <CampManagement />}
          {activeTab === 'settings' && <ProfileSettings />}
        </main>
      </div>
    </div>
  );
}
