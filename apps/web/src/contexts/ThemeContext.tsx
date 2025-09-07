'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { getTheme } from '../components/theme/getTheme'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
    mode: ThemeMode
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

interface ThemeProviderProps {
    children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>('light')

    useEffect(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme') as ThemeMode
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            setMode(savedTheme)
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setMode(prefersDark ? 'dark' : 'light')
        }
    }, [])

    useEffect(() => {
        // Save theme preference to localStorage
        localStorage.setItem('theme', mode)
    }, [mode])

    const toggleTheme = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')
    }


    const contextValue: ThemeContextType = {
        mode,
        toggleTheme,
    }

    const theme = getTheme(mode)

    return (
        <ThemeContext.Provider value={contextValue}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    )
}
