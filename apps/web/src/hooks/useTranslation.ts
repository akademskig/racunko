'use client'

import { useMemo } from 'react'
import { useLocale } from '../contexts/LocaleContext'
import translations from '@web/translations'

// Safe hook that handles router not being mounted
export const useTranslation = () => {
    const { locale } = useLocale()

    const t = useMemo(() => {
        return translations[locale as keyof typeof translations] || translations.en
    }, [locale])

    return { t, locale }
}

// Utility function for getting translations without hooks (for use in non-component contexts)
export const getTranslation = (locale: string = 'en') => {
    return translations[locale as keyof typeof translations] || translations.en
}
