"use client";

import { usePathname } from 'next/navigation';
import BottomNav from './bottom-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noNavRoutes = ['/login', '/signup'];

  const showNav = !noNavRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-20">{children}</main>
      {showNav && <BottomNav />}
    </div>
  );
}
