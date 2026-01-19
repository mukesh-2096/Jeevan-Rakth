"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Overview from "./components/Overview";
import BloodInventory from "./components/BloodInventory";
import DonorManagement from "./components/DonorManagement";
import EmergencyRequests from './components/EmergencyRequests';
import Settings from './components/Settings';
import ToastNotification from "@/components/Toast";

type PendingRegistration = {
  id: string;
  name: string;
  bloodType: string;
  phone: string;
  email: string;
  location: string;
  age: number;
  gender: string;
  submittedAt: string;
};

type ToastType = {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
};

export default function HospitalDashboard() {
  const { user, loading } = useAuth({ requiredRole: 'hospital' });
  
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hospitalActiveTab') || 'overview';
    }
    return 'overview';
  });

  // Notification System State
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([]);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [previousCount, setPreviousCount] = useState(0);
  const [refreshDonors, setRefreshDonors] = useState(0);
  const [refreshOverview, setRefreshOverview] = useState(0);

  // Fetch pending registrations from API
  const fetchPendingRegistrations = async () => {
    try {
      setLoadingRegistrations(true);
      const response = await fetch('/api/hospital/registrations', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      // Even if there's an error, set the pendingRegistrations (could be empty array)
      if (data.pendingRegistrations) {
        const newCount = data.pendingRegistrations.length;
        
        // Show notification if new requests came in
        if (previousCount > 0 && newCount > previousCount) {
          const newRequestsCount = newCount - previousCount;
          showToast('info', `${newRequestsCount} new donor registration request${newRequestsCount > 1 ? 's' : ''} received!`);
        }
        
        setPendingRegistrations(data.pendingRegistrations);
        setPreviousCount(newCount);
      } else {
        setPendingRegistrations([]);
        setPreviousCount(0);
      }
      
      // Only show error toast if it's a server error, not authentication issues
      if (!response.ok && response.status >= 500) {
        console.error('Failed to fetch registrations:', data.error);
        showToast('error', 'Failed to load pending registrations');
      }
    } catch (error) {
      console.error('Error fetching pending registrations:', error);
      setPendingRegistrations([]);
      setPreviousCount(0);
      // Don't show error toast - fail silently for better UX
    } finally {
      setLoadingRegistrations(false);
    }
  };

  // Fetch pending registrations on component mount and when user changes
  useEffect(() => {
    if (user && user.role === 'hospital' && !loading) {
      fetchPendingRegistrations();
      
      // Poll for new registrations every 60 seconds (increased from 30 to reduce load)
      const interval = setInterval(fetchPendingRegistrations, 60000);
      return () => clearInterval(interval);
    }
  }, [user, loading]);

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const handleApproveRegistration = async (id: string) => {
    const registration = pendingRegistrations.find(r => r.id === id);
    if (!registration) return;

    try {
      const response = await fetch(`/api/hospital/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve registration');
      }

      setPendingRegistrations(prev => prev.filter(r => r.id !== id));
      showToast('success', `${registration.name} has been approved as a donor!`);
      
      // Trigger refresh of donors list
      setRefreshDonors(prev => prev + 1);
      // Trigger refresh of overview
      setRefreshOverview(prev => prev + 1);
    } catch (error) {
      console.error('Error approving registration:', error);
      showToast('error', 'Failed to approve registration. Please try again.');
    }
  };

  const handleRejectRegistration = async (id: string) => {
    const registration = pendingRegistrations.find(r => r.id === id);
    if (!registration) return;

    try {
      const response = await fetch(`/api/hospital/registrations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject registration');
      }

      setPendingRegistrations(prev => prev.filter(r => r.id !== id));
      showToast('info', `${registration.name}'s registration has been rejected.`);
      // Trigger refresh of overview
      setRefreshOverview(prev => prev + 1);
    } catch (error) {
      console.error('Error rejecting registration:', error);
      showToast('error', 'Failed to reject registration. Please try again.');
    }
  };

  const handleNotificationClick = () => {
    setActiveTab('donor-management');
  };

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
        <Navbar 
          activeTab={activeTab} 
          user={user} 
          pendingRegistrations={pendingRegistrations}
          onNotificationClick={handleNotificationClick}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden max-w-full">
          {activeTab === "overview" && <Overview user={user} refreshTrigger={refreshOverview} />}
          {activeTab === "blood-inventory" && <BloodInventory user={user} refreshTrigger={refreshOverview} />}
          {activeTab === "donor-management" && (
            <DonorManagement 
              user={user} 
              pendingRegistrations={pendingRegistrations}
              onApproveRegistration={handleApproveRegistration}
              onRejectRegistration={handleRejectRegistration}
              loadingRegistrations={loadingRegistrations}
              refreshTrigger={refreshDonors}
              showToast={showToast}
              onRefreshOverview={() => setRefreshOverview(prev => prev + 1)}
            />
          )}
          {activeTab === "emergency-requests" && <EmergencyRequests user={user} />}
          {activeTab === "settings" && <Settings user={user} />}
        </main>
      </div>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <ToastNotification
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
