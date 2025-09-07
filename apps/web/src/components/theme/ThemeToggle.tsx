'use client'

import React from 'react'
import { IconButton, Tooltip, Box } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useTheme } from '../../contexts/ThemeContext'

export const ThemeToggle: React.FC = () => {
    const { mode, toggleTheme } = useTheme()

    return (
        <Box>
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton
                    onClick={toggleTheme}
                    color="inherit"
                    sx={{
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
            </Tooltip>
        </Box>
    )
}
