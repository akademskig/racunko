'use client';

import React from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';
import { useNotificationsList, useRemoveNotification } from '../stores/appStore';

export const NotificationProvider: React.FC = () => {
  const notifications = useNotificationsList();
  const remove = useRemoveNotification();

  const handleClose = (id: string) => {
    remove(id);
  };

  return (
    <>
      {notifications.map(notification => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration || 5000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type as AlertColor}
            variant='filled'
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};
