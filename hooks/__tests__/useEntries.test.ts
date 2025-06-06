import { renderHook, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEntries } from '../useEntries';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('useEntries', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockReset();
    (AsyncStorage.setItem as jest.Mock).mockReset();
  });

  it('saves entries and retrieves them by date', async () => {
    const storedEntries = [
      {
        date: '2024-01-01',
        entries: ['a', 'b', 'c', 'd', 'e'],
      },
    ];

    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(null) // initial load in saveEntries
      .mockResolvedValueOnce(JSON.stringify(storedEntries)); // load in getEntriesByDate

    const { result } = renderHook(() => useEntries());

    await act(async () => {
      const success = await result.current.saveEntries(
        ['a', 'b', 'c', 'd', 'e'],
        '2024-01-01',
      );
      expect(success).toBe(true);
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'daily_five_entries',
      JSON.stringify(storedEntries),
    );

    let retrieved: string[] | null = null;
    await act(async () => {
      retrieved = await result.current.getEntriesByDate('2024-01-01');
    });

    expect(retrieved).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});
