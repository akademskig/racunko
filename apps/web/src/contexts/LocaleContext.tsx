'use client'

import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useLocale as useAppLocale, useSetLocale as useAppSetLocale, type Locale } from '../stores/appStore'

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
    initialLocale = 'hr'
}) => {
    const locale = useAppLocale()
    const setLocaleApp = useAppSetLocale()

    useEffect(() => {
        // Extract locale from URL path
        const pathSegments = window.location.pathname.split('/')
        const urlLocale = pathSegments[1] as Locale

        if (urlLocale && (urlLocale === 'en' || urlLocale === 'hr')) {
            setLocaleApp(urlLocale)
        } else if (initialLocale) {
            setLocaleApp(initialLocale)
        }
    }, [initialLocale, setLocaleApp])

    const setLocale = (newLocale: Locale) => {
        setLocaleApp(newLocale)

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
