
"use client";

import { usePathname, useRouter } from 'next/navigation';
import BottomNav from './bottom-nav';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const noNavRoutes = ['/login', '/signup', '/forgot-password', '/onboarding'];
  const authRoutes = ['/login', '/signup', '/forgot-password'];

  useEffect(() => {
    if (loading) return;

    if (!user && !authRoutes.includes(pathname) && pathname !== '/onboarding') {
      router.push('/login');
    } else if (user && authRoutes.includes(pathname)) {
      router.push('/home');
    }
  }, [user, loading, pathname, router]);


  const showNav = !noNavRoutes.includes(pathname) && !!user;

  if (loading || (!user && !authRoutes.includes(pathname) && pathname !== '/onboarding') || (user && authRoutes.includes(pathname))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-20">{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}
