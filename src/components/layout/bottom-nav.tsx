"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UserCircle2, Feather, Users, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/hooks/use-localization';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocalization();
  const itemsToUse = [
    { href: '/home', label: t('navHome'), icon: Home },
    { href: '/alerts', label: t('navAlerts'), icon: Feather },
    { href: '/progress', label: t('navProgress'), icon: LineChart },
    { href: '/community', label: t('navCommunity'), icon: Users },
    { href: '/profile', label: t('navProfile'), icon: UserCircle2 },
  ]


  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-lg border-t border-border/20 shadow-t-2xl z-40 rounded-t-2xl">
        <div className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
          {itemsToUse.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href!} className="flex-1">
                <div
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all duration-200 ease-in-out hover:text-primary',
                    isActive && 'text-primary scale-110'
                  )}
                >
                  <item.icon className="w-7 h-7" />
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