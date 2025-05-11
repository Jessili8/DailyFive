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

  const saveEntries = useCallback(async (entries: string[], date?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use provided date or today's date
      const entryDate = date || format(new Date(), 'yyyy-MM-dd');
      
      // Get all existing entries
      const storedData = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
      const allEntries: DailyEntry[] = storedData ? JSON.parse(storedData) : [];
      
      // Check if we already have an entry for this date
      const dateIndex = allEntries.findIndex(entry => entry.date === entryDate);
      
      if (dateIndex >= 0) {
        // Update existing entry
        allEntries[dateIndex].entries = entries;
      } else {
        // Add new entry
        allEntries.unshift({
          date: entryDate,
          entries,
        });
      }
      
      // Sort entries by date (newest first)
      allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
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

  const getEntriesByDate = useCallback(async (date: string): Promise<string[] | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const storedData = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
      const allEntries: DailyEntry[] = storedData ? JSON.parse(storedData) : [];
      
      const dateEntry = allEntries.find(entry => entry.date === date);
      
      return dateEntry ? dateEntry.entries : ['', '', '', '', ''];
    } catch (err) {
      setError(`Failed to get entries for ${date}`);
      console.error(`Failed to get entries for ${date}:`, err);
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

  const exportToCSV = useCallback(async (): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      const allEntries = await getAllEntries();
      
      // Create CSV header
      let csv = 'Date,Entry 1,Entry 2,Entry 3,Entry 4,Entry 5\n';
      
      // Add entries to CSV
      allEntries.forEach(({ date, entries }) => {
        // Format date for better readability
        const formattedDate = format(new Date(date), 'MM/dd/yyyy');
        
        // Escape and clean entries to prevent CSV injection
        const cleanedEntries = entries.map(entry => {
          // Remove newlines and quotes
          const cleaned = entry.replace(/[\n\r"]/g, ' ').trim();
          // Escape commas by wrapping in quotes
          return cleaned.includes(',') ? `"${cleaned}"` : cleaned;
        });
        
        csv += `${formattedDate},${cleanedEntries.join(',')}\n`;
      });
      
      return csv;
    } catch (err) {
      setError('Failed to export entries');
      console.error('Failed to export entries:', err);
      return '';
    } finally {
      setLoading(false);
    }
  }, [getAllEntries]);

  return {
    loading,
    error,
    saveEntries,
    getTodayEntries,
    getAllEntries,
    getEntriesByDate,
    clearAllEntries,
    exportToCSV,
  };
};