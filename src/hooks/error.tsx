import { AxiosError } from 'axios';
import React from 'react';
import { NotificationStateContext } from '../../components/Notification';

export const useShowError = () => {
  const { setNotify } = React.useContext(NotificationStateContext);
  const showError = React.useCallback(
    (error: any) => {
      // console.log(error)
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
