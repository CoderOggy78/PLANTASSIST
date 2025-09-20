"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UserCircle2, Feather, Users, LineChart, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalization } from '@/hooks/use-localization';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocalization();
  const mainItems = [
    { href: '/home', label: t('navHome'), icon: Home },
    { href: '/alerts', label: t('navAlerts'), icon: Feather },
    { href: '/progress', label: t('navProgress'), icon: LineChart },
    { href: '/community', label: t('navCommunity'), icon: Users },
    { href: '/profile', label: t('navProfile'), icon: UserCircle2 },
  ]


  return (
    <>
      <div className="fixed bottom-20 sm:bottom-6 z-50 w-full flex justify-center pointer-events-none">
          <Link href="/" passHref className="pointer-events-auto">
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className="bg-primary text-primary-foreground rounded-full h-20 w-20 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform hover:scale-110"
              >
                <ScanLine className="w-10 h-10" />
              </motion.div>
          </Link>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-lg border-t border-border/20 shadow-t-2xl z-40 rounded-t-2xl">
        <div className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
          {mainItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isCenterItem = index === 2;
            return (
              <div key={item.href} className={cn("flex-1", isCenterItem && "opacity-0 pointer-events-none")}>
                <Link href={item.href!} className="w-full h-full">
                  <div
                    className={cn(
                      'flex flex-col items-center justify-center gap-1 text-muted-foreground transition-all duration-200 ease-in-out hover:text-primary h-full',
                      isActive && 'text-primary scale-110'
                    )}
                  >
                    <item.icon className="w-7 h-7" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
