'use client'

import React from 'react'
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
} from '@mui/material'
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Receipt as ReceiptIcon,
    People as PeopleIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material'
import { useSidebarOpen, useSetSidebarOpen } from '../stores/appStore'

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, href: '/' },
    { text: 'Invoices', icon: <ReceiptIcon />, href: '/invoices' },
    { text: 'Clients', icon: <PeopleIcon />, href: '/clients' },
    { text: 'Settings', icon: <SettingsIcon />, href: '/settings' },
]

export const Sidebar: React.FC = () => {
    const isOpen = useSidebarOpen()
    const setOpen = useSetSidebarOpen()

    return (
        <>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setOpen(true)}
                edge="start"
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>

            <Drawer
                variant="temporary"
                open={isOpen}
                onClose={() => setOpen(false)}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 240,
                    },
                }}
            >
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton component="a" href={item.href}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
            </Drawer>
        </>
    )
}
