'use client'

import { ThemeProvider } from '../contexts/ThemeContext'
import CssBaseline from '@mui/material/CssBaseline'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}