import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parse, isValid } from 'date-fns';

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
      
      const entryDate = date || format(new Date(), 'yyyy-MM-dd');
      const storedData = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
      const allEntries: DailyEntry[] = storedData ? JSON.parse(storedData) : [];
      
      const dateIndex = allEntries.findIndex(entry => entry.date === entryDate);
      
      if (dateIndex >= 0) {
        allEntries[dateIndex].entries = entries;
      } else {
        allEntries.unshift({
          date: entryDate,
          entries,
        });
      }
      
      allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
      
      const today = format(new Date(), 'yyyy-MM-dd');
      const storedData = await AsyncStorage.getItem(ENTRIES_STORAGE_KEY);
      const allEntries: DailyEntry[] = storedData ? JSON.parse(storedData) : [];
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

  const importFromCSV = useCallback(async (csvContent: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const lines = csvContent.split('\n');
      const headers = lines[0].split(',');

      // Validate headers
      const expectedHeaders = ['Date', 'Entry 1', 'Entry 2', 'Entry 3', 'Entry 4', 'Entry 5'];
      const isValidHeader = headers.every((header, index) => 
        header.trim() === expectedHeaders[index]
      );

      if (!isValidHeader) {
        throw new Error('Invalid CSV format. Please use the correct template.');
      }

      const entries: DailyEntry[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',').map(value => 
          value.trim().replace(/^"(.*)"$/, '$1')
        );

        // Try parsing the date in yyyy-MM-dd format first
        let parsedDate = parse(values[0], 'yyyy-MM-dd', new Date());
        
        // If that fails, try MM/dd/yyyy format
        if (!isValid(parsedDate)) {
          parsedDate = parse(values[0], 'MM/dd/yyyy', new Date());
          
          // If both formats fail, throw an error
          if (!isValid(parsedDate)) {
            throw new Error(`Invalid date format at line ${i + 1}. Use either yyyy-MM-dd or MM/dd/yyyy format.`);
          }
        }

        const date = format(parsedDate, 'yyyy-MM-dd');
        const dailyEntries = values.slice(1);

        if (dailyEntries.length !== 5) {
          throw new Error(`Invalid number of entries at line ${i + 1}`);
        }

        entries.push({
          date,
          entries: dailyEntries,
        });
      }

      // Sort entries by date (newest first)
      entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Save to storage
      await AsyncStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
      return true;
    } catch (err) {
      setError('Failed to import CSV');
      console.error('Failed to import CSV:', err);
      alert(err instanceof Error ? err.message : 'Failed to import CSV');
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
      let csv = 'Date,Entry 1,Entry 2,Entry 3,Entry 4,Entry 5\n';
      
      allEntries.forEach(({ date, entries }) => {
        const formattedDate = format(new Date(date), 'MM/dd/yyyy');
        const cleanedEntries = entries.map(entry => {
          const cleaned = entry.replace(/[\n\r"]/g, ' ').trim();
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
    importFromCSV,
  };
};