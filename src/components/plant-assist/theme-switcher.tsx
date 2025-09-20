"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('light')}
        className={cn('w-full', theme === 'light' && 'bg-background shadow-sm')}
      >
        <Sun className="h-5 w-5 mr-2" />
        Light
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('dark')}
        className={cn('w-full', theme === 'dark' && 'bg-background shadow-sm')}
      >
        <Moon className="h-5 w-5 mr-2" />
        Dark
      </Button>
    </div>
  );
}
