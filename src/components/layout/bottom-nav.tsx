
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, UserCircle2, ScanLine, MessageSquare, Feather, Users, CalendarDays, FlaskConical, Notebook, AreaChart, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();
  const itemsToUse = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/alerts', label: 'Alerts', icon: Feather },
    { href: '/progress', label: 'Progress', icon: LineChart },
    { href: 'BLANK' }, // Placeholder for the FAB
    { href: '/calendar', label: 'Calendar', icon: CalendarDays },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/profile', label: 'Profile', icon: UserCircle2 },
  ]


  return (
    <>
      <div className="fixed bottom-20 sm:bottom-18 z-20 w-full flex justify-center pointer-events-none">
          <Link href="/" passHref className="pointer-events-auto">
              <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform hover:scale-110">
                  <ScanLine className="h-8 w-8" />
              </div>
          </Link>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-t-lg z-10">
        <div className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
          {itemsToUse.map((item, index) => {
            if (item.href === 'BLANK') {
              return <div key={index} className="w-12 sm:w-16" />; // Empty space for FAB
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
      
      <nav className="fixed bottom-16 left-0 right-0 h-10 bg-card/90 backdrop-blur-sm z-10 sm:hidden">
        <div className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
            <Link href="/soil-health" className="flex-1">
                <div className={cn('flex flex-col items-center justify-center gap-1 text-muted-foreground', pathname === '/soil-health' && 'text-primary')}>
                    <FlaskConical className="w-5 h-5"/>
                    <span className="text-[10px] font-medium">Soil</span>
                </div>
            </Link>
             <Link href="/diary" className="flex-1">
                <div className={cn('flex flex-col items-center justify-center gap-1 text-muted-foreground', pathname === '/diary' && 'text-primary')}>
                    <Notebook className="w-5 h-5"/>
                    <span className="text-[10px] font-medium">Diary</span>
                </div>
            </Link>
            <Link href="/yield-prediction" className="flex-1">
                <div className={cn('flex flex-col items-center justify-center gap-1 text-muted-foreground', pathname === '/yield-prediction' && 'text-primary')}>
                    <AreaChart className="w-5 h-5"/>
                    <span className="text-[10px] font-medium">Yield</span>
                </div>
            </Link>
            <Link href="/schemes" className="flex-1">
                <div className={cn('flex flex-col items-center justify-center gap-1 text-muted-foreground', pathname === '/schemes' && 'text-primary')}>
                    <Landmark className="w-5 h-5"/>
                    <span className="text-[10px] font-medium">Schemes</span>
                </div>
            </Link>
            <Link href="/chat" className="flex-1">
                 <div className={cn('flex flex-col items-center justify-center gap-1 text-muted-foreground', pathname === '/chat' && 'text-primary')}>
                    <MessageSquare className="w-5 h-5"/>
                    <span className="text-[10px] font-medium">Chat</span>
                </div>
            </Link>
        </div>
      </nav>
    </>
  );
}
