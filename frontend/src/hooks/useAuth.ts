import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function useAuth(requiredRoles?: string[]) {
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth from localStorage
    initAuth();

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    // Check if user has required role
    if (requiredRoles && requiredRoles.length > 0) {
      if (!requiredRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        if (user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (user.role === 'petugas') {
          router.push('/petugas/dashboard');
        } else if (user.role === 'owner') {
          router.push('/owner/dashboard');
        }
      }
    }
  }, [isAuthenticated, user, router, requiredRoles, initAuth]);

  return { user, isAuthenticated };
}
