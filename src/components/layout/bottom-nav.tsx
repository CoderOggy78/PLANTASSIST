
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, UserCircle2, ScanLine, MessageSquare, Feather, Users, CalendarDays, FlaskConical, Notebook, AreaChart, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/hooks/use-localization';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocalization();
  const itemsToUse = [
    { href: '/home', label: t('navHome'), icon: Home },
    { href: '/alerts', label: t('navAlerts'), icon: Feather },
    { href: '/progress', label: t('navProgress'), icon: LineChart },
    { href: 'BLANK' }, // Placeholder for the FAB
    { href: '/calendar', label: t('navCalendar'), icon: CalendarDays },
    { href: '/community', label: t('navCommunity'), icon: Users },
    { href: '/profile', label: t('navProfile'), icon: UserCircle2 },
  ]


  return (
    <>
      <div className="fixed bottom-[4.5rem] sm:bottom-4 z-20 w-full flex justify-center pointer-events-none">
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
                    'flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all duration-200 ease-in-out hover:text-primary hover:scale-110',
                    isActive && 'text-primary scale-110'
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
                <div className={cn('flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all duration-200 ease-in-out hover:text-primary hover:scale-105', pathname === '/soil-health' && 'text-primary scale-105')}>
                    <FlaskConical className="w-5 h-5"/>
                    <span className="text-[10px] font-medium">{t('navSoil')}</span>
                </div>
            </Link>
             <Link href="/diary" className="flex-1">
                <div className={cn('flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all duration-200 ease-in-out hover:text-primary hover:scale-105', pathname === '/diary' && 'text-primary scale-105')}>
                    <Notebook className="w-5 h-5"/>
                    <span className="text-[10px] font-medium">{t('navDiary')}</span>
                </div>
            </Link>
            <Link href="/yield-prediction" className="flex-1">
                <div className={cn('flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all duration-200 ease-in-out hover:text-primary hover:scale-105', pathname === '/yield-prediction' && 'text-primary scale-105')}>
                    <AreaChart className="w-5 h-5"/>
                    <span className="text-[10px] font-medium">{t('navYield')}</span>
                </div>
            </Link>
            <Link href="/schemes" className="flex-1">
                <div className={cn('flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all duration-200 ease-in-out hover:text-primary hover:scale-105', pathname === '/schemes' && 'text-primary scale-105')}>
                    <Landmark className="w-5 h-5"/>
                    <span className="text-[10px] font-medium">{t('navSchemes')}</span>
                </div>
            </Link>
            <Link href="/chat" className="flex-1">
                 <div className={cn('flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all duration-200 ease-in-out hover:text-primary hover:scale-105', pathname === '/chat' && 'text-primary scale-105')}>
                    <MessageSquare className="w-5 h-5"/>
                    <span className="text-[10px] font-medium">{t('navChat')}</span>
                </div>
            </Link>
        </div>
      </nav>
    </>
  );
}
