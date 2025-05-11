import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { colors } from '@/constants/colors';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
  colors: typeof colors.light | typeof colors.dark;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  isDark: false,
  colors: colors.light,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');
  
  const isDark = 
    theme === 'system' 
      ? colorScheme === 'dark'
      : theme === 'dark';
  
  const currentColors = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        isDark,
        colors: currentColors 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};