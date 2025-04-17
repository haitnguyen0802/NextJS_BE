'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  // If loading, show a simple loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, don't show anything while redirecting
  if (!user) {
    return null;
  }

  // If logged in, show the children
  return <>{children}</>;
};

export default PrivateRoute; 