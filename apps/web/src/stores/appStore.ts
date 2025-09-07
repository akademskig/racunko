import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { getTheme } from '@web/theme/getTheme'

// Cached themes to avoid infinite loops
const themes = {
    light: getTheme('light'),
    dark: getTheme('dark'),
}

// Types
export interface Invoice {
    id: string
    invoiceNumber: string
    issueDate: string
    dueDate?: string
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
    total: number
    currency: string
    client: {
        name: string
    }
    company: {
        name: string
    }
}

export type Locale = 'en' | 'hr'

export type ThemeMode = 'light' | 'dark'

export interface AppState {
    // UI State
    sidebarOpen: boolean
    notifications: Notification[]
    locale: Locale
    themeMode: ThemeMode

    // Actions
    setThemeMode: (themeMode: ThemeMode) => void
    toggleSidebar: () => void
    setSidebarOpen: (open: boolean) => void
    addNotification: (notification: Omit<Notification, 'id'>) => void
    removeNotification: (id: string) => void
    clearNotifications: () => void
    setLocale: (locale: Locale) => void
}

interface Notification {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
}

// Create the store
export const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set, get) => ({
                // Initial state
                sidebarOpen: false,
                notifications: [],
                locale: 'en' as Locale,
                themeMode: window ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : 'light' as ThemeMode,
                // Actions
                setThemeMode: (themeMode: ThemeMode) => set({ themeMode }),
                toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
                setSidebarOpen: (open) => set({ sidebarOpen: open }),
                setLocale: (locale) => set({ locale }),
                addNotification: (notification) => {
                    const id = Math.random().toString(36).substr(2, 9)
                    const newNotification = { ...notification, id }
                    set((state) => ({
                        notifications: [...state.notifications, newNotification]
                    }))

                    // Auto-remove notification after duration
                    if (notification.duration !== 0) {
                        setTimeout(() => {
                            get().removeNotification(id)
                        }, notification.duration || 5000)
                    }
                },

                removeNotification: (id) => set((state) => ({
                    notifications: state.notifications.filter(n => n.id !== id)
                })),

                clearNotifications: () => set({ notifications: [] }),
            }),
            {
                name: 'app-store',
                partialize: (state) => ({ sidebarOpen: state.sidebarOpen, locale: state.locale, themeMode: state.themeMode }),
            }
        ),
        {
            name: 'app-store',
        }
    )
)

// Individual selectors to avoid object recreation
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen)
export const useToggleSidebar = () => useAppStore((state) => state.toggleSidebar)
export const useSetSidebarOpen = () => useAppStore((state) => state.setSidebarOpen)

export const useNotificationsList = () => useAppStore((state) => state.notifications)
export const useAddNotification = () => useAppStore((state) => state.addNotification)
export const useRemoveNotification = () => useAppStore((state) => state.removeNotification)
export const useClearNotifications = () => useAppStore((state) => state.clearNotifications)

export const useLocale = () => useAppStore((state) => state.locale)
export const useSetLocale = () => useAppStore((state) => state.setLocale)

// Convenience hooks that return objects (use with caution in SSR)
export const useSidebar = () => {
    const sidebarOpen = useSidebarOpen()
    const toggleSidebar = useToggleSidebar()
    const setSidebarOpen = useSetSidebarOpen()

    return {
        isOpen: sidebarOpen,
        toggle: toggleSidebar,
        setOpen: setSidebarOpen,
    }
}

export const useNotifications = () => {
    const notifications = useNotificationsList()
    const addNotification = useAddNotification()
    const removeNotification = useRemoveNotification()
    const clearNotifications = useClearNotifications()

    return {
        notifications,
        add: addNotification,
        remove: removeNotification,
        clear: clearNotifications,
    }
}

export const useTheme = () => {
    const themeMode = useAppStore((state) => state.themeMode)
    const setThemeMode = useAppStore((state) => state.setThemeMode)

    return {
        theme: themes[themeMode],
        themeMode,
        toggleTheme: () => setThemeMode(themeMode === 'light' ? 'dark' : 'light'),
    }
}
