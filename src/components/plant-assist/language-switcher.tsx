
"use client";

import { useLocalization } from '@/hooks/use-localization';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'mr' | 'gu';
const languages: { id: Language, label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिन्दी' },
    { id: 'mr', label: 'मराठी' },
    { id: 'gu', label: 'ગુજરાતી' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLocalization();
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleLanguageChange = (newLanguage: Language) => {
    setSelectedLanguage(newLanguage);
    setTimeout(() => {
        setLanguage(newLanguage);
    }, 700);
  }

  const getHighlightStyle = () => {
    const selectedIndex = languages.findIndex(l => l.id === selectedLanguage);
    if (selectedIndex === -1) return {};
    return {
        left: `calc(${selectedIndex * 25}% + 2px)`,
    };
  }

  return (
    <div className="relative flex items-center gap-1 p-1 bg-muted rounded-full w-[280px]">
        <motion.div
            layoutId="language-switcher-highlight"
            className="absolute h-[calc(100%-8px)] w-[calc(25%-4px)] bg-background rounded-md shadow-lg shadow-primary/50"
            style={getHighlightStyle()}
            transition={{ type: "tween", duration: 0.7, ease: "easeInOut" }}
        />
        {languages.map(lang => (
             <Button
                key={lang.id}
                variant="ghost"
                size="sm"
                onClick={() => handleLanguageChange(lang.id)}
                className={cn('w-full z-10 text-xs', selectedLanguage === lang.id ? 'text-foreground' : 'text-muted-foreground')}
            >
                {lang.label}
            </Button>
        ))}
    </div>
  );
}
