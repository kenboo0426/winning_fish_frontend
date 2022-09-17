import React from 'react';
import { NotificationStateContext } from '../../components/organisms/Notification';

export const useShowError = () => {
  const { setNotify } = React.useContext(NotificationStateContext);
  const showError = React.useCallback(
    (error: any) => {
      const errorMessage: string[] = [error.message];
      setNotify({
        type: 'error',
        message: errorMessage,
        open: true,
      });
    },
    [setNotify]
  );
  return showError;
};
