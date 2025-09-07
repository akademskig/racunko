'use client';
import { createContext } from 'react';
import { useTheme } from '@web/stores/appStore';
import { Theme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeContextType {
  theme: Theme;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useTheme();

  return (
    <ThemeContext.Provider value={{ theme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
