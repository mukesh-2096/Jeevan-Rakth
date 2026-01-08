"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthUser {
  id: string;
  email: string;
  role: "donor" | "hospital" | "ngo";
  name: string;
}

interface UseAuthOptions {
  requiredRole?: "donor" | "hospital" | "ngo";
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        
        if (!response.ok) {
          // Not authenticated - redirect to login
          router.push(options.redirectTo || "/login");
          return;
        }

        const data = await response.json();
        const userData = data.user;

        // Check if user has the required role
        if (options.requiredRole && userData.role !== options.requiredRole) {
          // User is logged in but doesn't have the right role
          // Redirect them to their correct dashboard
          router.push(`/dashboard/${userData.role}`);
          return;
        }

        setUser(userData);
      } catch (err) {
        console.error("Auth check failed:", err);
        setError("Authentication failed");
        router.push(options.redirectTo || "/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, options.requiredRole, options.redirectTo]);

  return { user, loading, error };
}
