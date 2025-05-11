import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

const ENTRIES_STORAGE_KEY = 'daily_five_entries';

interface DailyEntry {
  date: string;
  entries: string[];
}

export const useEntries = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveEntries = useCallback(async (entries: string[]) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get today's date in ISO format
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Get all existing entries
      const storedData = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
      const allEntries: DailyEntry[] = storedData ? JSON.parse(storedData) : [];
      
      // Check if we already have an entry for today
      const todayIndex = allEntries.findIndex(entry => entry.date === today);
      
      if (todayIndex >= 0) {
        // Update today's entry
        allEntries[todayIndex].entries = entries;
      } else {
        // Add new entry for today
        allEntries.unshift({
          date: today,
          entries,
        });
      }
      
      // Save back to storage
      await AsyncStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(allEntries));
      
      return true;
    } catch (err) {
      setError('Failed to save entries');
      console.error('Failed to save entries:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTodayEntries = useCallback(async (): Promise<string[] | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Get today's date in ISO format
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Get all stored entries
      const storedData = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
      const allEntries: DailyEntry[] = storedData ? JSON.parse(storedData) : [];
      
      // Find today's entry
      const todayEntry = allEntries.find(entry => entry.date === today);
      
      return todayEntry ? todayEntry.entries : ['', '', '', '', ''];
    } catch (err) {
      setError('Failed to get today\'s entries');
      console.error('Failed to get today\'s entries:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllEntries = useCallback(async (): Promise<DailyEntry[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const storedData = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (err) {
      setError('Failed to get all entries');
      console.error('Failed to get all entries:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getEntryByDate = useCallback(async (date: string): Promise<string[] | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const storedData = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
      const allEntries: DailyEntry[] = storedData ? JSON.parse(storedData) : [];
      
      const dateEntry = allEntries.find(entry => entry.date === date);
      
      return dateEntry ? dateEntry.entries : null;
    } catch (err) {
      setError(`Failed to get entries for ${date}`);
      console.error(`Failed to get entries for ${date}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAllEntries = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await AsyncStorage.removeItem(ENTRIES_STORAGE_KEY);
      
      return true;
    } catch (err) {
      setError('Failed to clear entries');
      console.error('Failed to clear entries:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    saveEntries,
    getTodayEntries,
    getAllEntries,
    getEntryByDate,
    clearAllEntries,
  };
};