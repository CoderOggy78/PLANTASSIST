
"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative flex items-center gap-2 p-1 bg-muted rounded-full">
        {theme === 'light' && (
            <motion.div
                layoutId="theme-switcher-highlight"
                className="absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-background rounded-md shadow-sm"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
        )}
        {theme === 'dark' && (
             <motion.div
                layoutId="theme-switcher-highlight"
                className="absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-background rounded-md shadow-sm right-1"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
        )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('light')}
        className={cn('w-full z-10', theme === 'light' ? 'text-foreground' : 'text-muted-foreground')}
      >
        <Sun className="h-5 w-5 mr-2" />
        Light
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('dark')}
        className={cn('w-full z-10', theme === 'dark' ? 'text-foreground' : 'text-muted-foreground')}
      >
        <Moon className="h-5 w-5 mr-2" />
        Dark
      </Button>
    </div>
  );
}
