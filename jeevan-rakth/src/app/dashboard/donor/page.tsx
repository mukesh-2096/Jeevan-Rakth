"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Overview from "./components/Overview";
import MyRegistrations from "./components/MyRegistrations";
import ProfileSettings from "./components/ProfileSettings";
import MyAccount from "./components/MyAccount";
import RegistrationForm from "./components/registration/RegistrationForm";

export default function DonorDashboard() {
  const { user, loading } = useAuth({ requiredRole: 'donor' });
  
  // Load active tab from localStorage or default to overview
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('donorActiveTab') || 'overview';
    }
    return 'overview';
  });

  // Reset to overview if user just logged in (no previous session)
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      const hasSession = sessionStorage.getItem('dashboardVisited');
      if (!hasSession) {
        // First visit in this session - reset to overview
        setActiveTab('overview');
        localStorage.setItem('donorActiveTab', 'overview');
        sessionStorage.setItem('dashboardVisited', 'true');
      }
    }
  }, [user]);

  // Save active tab to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('donorActiveTab', activeTab);
    }
  }, [activeTab]);

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "overview" && <Overview user={user} />}
          {activeTab === "my-registrations" && <MyRegistrations setActiveTab={setActiveTab} />}
          {activeTab === "register" && <RegistrationForm onBack={() => setActiveTab('my-registrations')} />}
          {activeTab === "profile" && <ProfileSettings user={user} />}
          {activeTab === "my-account" && <MyAccount user={user} />}
        </main>
      </div>
    </div>
  );
}
