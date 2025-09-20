
"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  // We use a local state to drive the animation immediately,
  // and then update the global theme after a short delay.
  const [selectedTheme, setSelectedTheme] = useState(theme);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setSelectedTheme(newTheme);
    // Delay the actual theme change to allow the animation to feel smoother.
    setTimeout(() => {
        setTheme(newTheme);
    }, 700);
  }

  return (
    <div className="relative flex items-center gap-2 p-1 bg-muted rounded-full">
        <motion.div
            layoutId="theme-switcher-highlight"
            className="absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-background rounded-md shadow-lg shadow-primary/50"
            style={{
                left: selectedTheme === 'light' ? '4px' : 'calc(50% + 2px)',
            }}
            transition={{ type: "tween", duration: 0.7, ease: "easeInOut" }}
        />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleThemeChange('light')}
        className={cn('w-full z-10', selectedTheme === 'light' ? 'text-foreground' : 'text-muted-foreground')}
      >
        <Sun className="h-5 w-5 mr-2" />
        Light
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleThemeChange('dark')}
        className={cn('w_full z-10', selectedTheme === 'dark' ? 'text-foreground' : 'text-muted-foreground')}
      >
        <Moon className="h-5 w-5 mr-2" />
        Dark
      </Button>
    </div>
  );
}
