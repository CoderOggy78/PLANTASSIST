
"use client";

import { usePathname, useRouter } from 'next/navigation';
import BottomNav from './bottom-nav';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const noNavRoutes = ['/login', '/signup', '/forgot-password', '/onboarding'];
  const authRoutes = ['/login', '/signup', '/forgot-password'];
  
  useEffect(() => {
    if (loading) return;

    if (!user && !noNavRoutes.includes(pathname)) {
      router.push('/login');
    } else if (user && authRoutes.includes(pathname)) {
      router.push('/home');
    }
  }, [user, loading, pathname, router]);


  const showNav = !noNavRoutes.includes(pathname) && !!user;

  if (loading || (!user && !noNavRoutes.includes(pathname)) || (user && authRoutes.includes(pathname))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
          <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AnimatePresence mode="wait">
        <motion.main
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-grow pb-28 sm:pb-28"
        >
            {children}
        </motion.main>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </div>
  );
}
