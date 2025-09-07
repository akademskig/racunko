'use client'

import { ThemeProvider } from '../contexts/ThemeContext'
import { QueryProvider } from '../providers/QueryProvider'
import { NotificationProvider } from '../components/NotificationProvider'
import CssBaseline from '@mui/material/CssBaseline'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ThemeProvider>
            <CssBaseline />
            <NotificationProvider />
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}