'use client'

import React from 'react'
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip
} from '@mui/material'
import { Language as LanguageIcon } from '@mui/icons-material'
import { useState } from 'react'
import { useLocale } from '@web/contexts/LocaleContext'

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
]

export const LanguageSwitcher: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const { locale, setLocale } = useLocale()

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLanguageChange = (newLocale: 'en' | 'hr') => {
        handleClose()
        setLocale(newLocale)
    }

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

    return (
        <>
            <Tooltip title="Change language">
                <IconButton
                    onClick={handleClick}
                    color="inherit"
                    sx={{
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                    }}
                >
                    <LanguageIcon />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {languages.map((language) => (
                    <MenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code as 'en' | 'hr')}
                        selected={language.code === locale}
                    >
                        <ListItemIcon>
                            <span style={{ fontSize: '1.2em' }}>{language.flag}</span>
                        </ListItemIcon>
                        <ListItemText primary={language.name} />
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}
