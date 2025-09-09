import { QueryProvider } from '../providers/QueryProvider';
import { CssBaseline } from '@mui/material';
import { NotificationProvider } from '../components/NotificationProvider';
import ThemeProvider from '../contexts/ThemeContext';
import { TopBar } from '@web/components/TopBar';

export const metadata = {
    title: 'Racunko',
    description: 'Racunko',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body>
                <QueryProvider>
                    <ThemeProvider>
                        <CssBaseline />
                        <NotificationProvider />
                        <TopBar />
                        {children}
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
