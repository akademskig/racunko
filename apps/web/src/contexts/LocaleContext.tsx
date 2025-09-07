'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Locale = 'en' | 'hr'

interface LocaleContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export const useLocale = () => {
    const context = useContext(LocaleContext)
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider')
    }
    return context
}

interface LocaleProviderProps {
    children: ReactNode
    initialLocale?: Locale
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({
    children,
    initialLocale = 'en'
}) => {
    const [locale, setLocaleState] = useState<Locale>(initialLocale)

    useEffect(() => {
        // Extract locale from URL path
        const pathSegments = window.location.pathname.split('/')
        const urlLocale = pathSegments[1] as Locale

        if (urlLocale && (urlLocale === 'en' || urlLocale === 'hr')) {
            setLocaleState(urlLocale)
        } else {
            // Fallback to localStorage
            const savedLocale = localStorage.getItem('locale') as Locale
            if (savedLocale && (savedLocale === 'en' || savedLocale === 'hr')) {
                setLocaleState(savedLocale)
            }
        }
    }, [])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem('locale', newLocale)

        // Update URL with new locale
        const currentPath = window.location.pathname
        const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}/, '') || '/'
        const newPath = `/${newLocale}${pathWithoutLocale}`

        // Navigate to new URL
        window.location.href = newPath
    }

    const contextValue: LocaleContextType = {
        locale,
        setLocale,
    }

    return (
        <LocaleContext.Provider value={contextValue}>
            {children}
        </LocaleContext.Provider>
    )
}
