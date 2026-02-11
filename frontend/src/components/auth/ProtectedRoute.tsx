"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Initialize auth from localStorage once
    initAuth();
  }, []); // Run only once on mount

  useEffect(() => {
    // Wait a bit for initAuth to complete
    const timer = setTimeout(() => {
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        console.log('ProtectedRoute: Not authenticated, redirecting to login');
        router.push('/login');
        return;
      }

      // Check if user has required role
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          console.log('ProtectedRoute: Wrong role, redirecting');
          // Redirect to appropriate dashboard based on role
          if (user.role === 'admin') {
            router.push('/admin/dashboard');
          } else if (user.role === 'petugas') {
            router.push('/petugas/dashboard');
          } else if (user.role === 'owner') {
            router.push('/owner/dashboard');
          }
          return;
        }
      }

      console.log('ProtectedRoute: Auth check passed');
      setIsChecking(false);
    }, 100); // Small delay to ensure localStorage is read

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router, allowedRoles]); // Removed initAuth

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated and authorized, show content
  if (isAuthenticated && user) {
    if (!allowedRoles || allowedRoles.includes(user.role)) {
      return <>{children}</>;
    }
  }

  // Otherwise, show nothing (will redirect)
  return null;
}
