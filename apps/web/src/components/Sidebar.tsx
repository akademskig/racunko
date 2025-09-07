'use client';

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useSidebarOpen, useSetSidebarOpen } from '../stores/appStore';
import { useTranslation } from '../hooks/useTranslation';

export const Sidebar: React.FC = () => {
  const isOpen = useSidebarOpen();
  const setOpen = useSetSidebarOpen();
  const { t } = useTranslation();

  const menuItems = [
    { text: t.navigation.dashboard, icon: <DashboardIcon />, href: '/' },
    { text: t.navigation.invoices, icon: <ReceiptIcon />, href: '/invoices' },
    { text: t.navigation.clients, icon: <PeopleIcon />, href: '/clients' },
    { text: t.navigation.settings, icon: <SettingsIcon />, href: '/settings' },
  ];

  return (
    <>
      <IconButton
        color='inherit'
        aria-label='open drawer'
        onClick={() => setOpen(true)}
        edge='start'
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant='temporary'
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
          {menuItems.map(item => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component='a' href={item.href}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
    </>
  );
};
