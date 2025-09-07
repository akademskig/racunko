import { createTheme } from '@mui/material';

const getTheme = (mode: 'dark' | 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: mode === 'dark' ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f5f5f5',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      success: {
        main: 'rgb(67, 160, 71)', // Dev green
      },
      error: {
        main: 'rgb(229, 57, 53)', // Red
      },
      warning: {
        main: 'rgb(251, 140, 0)', // Orange
      },
      info: {
        main: 'rgb(41, 182, 246)', // Sky Blue
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Remove gradient in dark mode
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
          },
        },
      },
    },
  });

export { getTheme };
