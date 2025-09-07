'use client'

import React from 'react'
import { IconButton, Tooltip, Box } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useTranslation } from '@web/hooks/useTranslation'
import { useTheme } from '@web/stores/appStore'

export const ThemeToggle: React.FC = () => {
    const { toggleTheme, themeMode } = useTheme()
    const { t } = useTranslation()

    return (
        <Box>
            <Tooltip title={themeMode === 'light' ? t.theme.switchToDark : t.theme.switchToLight}>
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
                    {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
            </Tooltip>
        </Box>
    )
}
