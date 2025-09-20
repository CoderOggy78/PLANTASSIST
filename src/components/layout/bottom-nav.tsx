
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, UserCircle2, ScanLine, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/knowledge-base', label: 'Knowledge', icon: BookOpen },
  { href: 'BLANK' }, // Placeholder for the FAB
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: UserCircle2 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="fixed bottom-20 sm:bottom-6 z-20 w-full flex justify-center pointer-events-none">
          <Link href="/" passHref className="pointer-events-auto">
              <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform hover:scale-110">
                  <ScanLine className="h-8 w-8" />
              </div>
          </Link>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-t-lg z-10">
        <div className="flex justify-around items-center h-full max-w-lg mx-auto">
          {navItems.map((item, index) => {
            if (item.href === 'BLANK') {
              return <div key={index} className="w-16" />; // Empty space for FAB
            }
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href!} className="flex-1">
                <div
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors',
                    isActive && 'text-primary'
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
