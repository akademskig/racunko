import { QueryProvider } from '../../providers/QueryProvider'
import { LocaleProvider } from '../../contexts/LocaleContext'
import { CssBaseline } from '@mui/material'
import { NotificationProvider } from '../../components/NotificationProvider'
import ThemeProvider from '../../contexts/ThemeContext'

export default function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { locale: string }
}) {
    return (
        <LocaleProvider initialLocale={params.locale as 'en' | 'hr'}>
            <QueryProvider>
                <ThemeProvider >
                    <CssBaseline />
                    <NotificationProvider />
                    {children}
                </ThemeProvider>
            </QueryProvider>
        </LocaleProvider>
    )
}
