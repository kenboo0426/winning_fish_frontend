import React, { createContext } from 'react';
import { Alert, List, ListItem, Snackbar } from '@mui/material';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

type Notification = {
  type: NotificationType;
  message: string | string[];
  open: boolean;
};

type Props = {
  children?: React.ReactNode;
};

export const NotificationStateContext = createContext(
  {} as {
    notify: Notification;
    setNotify: (notify: Notification) => void;
    handleCloseNotify: () => void;
  }
);

export const NotificationProvider: React.FC<Props> = ({ children }) => {
  const [notify, setNotify] = React.useState<Notification>({
    type: 'success',
    message: '',
    open: false,
  });

  const handleCloseNotify = React.useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setNotify({
        ...notify,
        open: false,
      });
    },
    [setNotify, notify]
  );

  return (
    <NotificationStateContext.Provider
      value={{ notify, setNotify, handleCloseNotify }}
    >
      <Snackbar
        open={notify.open}
        autoHideDuration={2000}
        onClose={handleCloseNotify}
      >
        <Alert
          onClose={handleCloseNotify}
          severity={notify.type}
          sx={{ width: '100%' }}
        >
          {typeof notify.message == 'string' ? (
            notify.message
          ) : (
            <List>
              {notify.message?.map((m) => (
                <ListItem key={m}>{m}</ListItem>
              ))}
            </List>
          )}
        </Alert>
      </Snackbar>
      {children}
    </NotificationStateContext.Provider>
  );
};
