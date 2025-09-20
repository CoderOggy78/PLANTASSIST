"use client";

import { useState, useEffect } from 'react';
import type { HistoryItem } from '@/lib/types';
import type { IdentifyPlantDiseaseFromImageOutput } from '@/ai/flows/identify-plant-disease-from-image';

const HISTORY_STORAGE_KEY = 'plantassist-history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const addHistoryItem = (image: string, result: IdentifyPlantDiseaseFromImageOutput) => {
    const newItem: HistoryItem = {
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      image,
      result,
    };
    
    setHistory(prevHistory => {
      const updatedHistory = [newItem, ...prevHistory];
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
      return updatedHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear history from localStorage", error);
    }
  }

  return { history, addHistoryItem, clearHistory, isLoaded };
}
