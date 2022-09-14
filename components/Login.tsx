import React from 'react';
import {
  loginByGoogleAuth,
  signOutFromGoogleAuth,
} from '../src/utils/userAuth';
import { NotificationStateContext } from './Notification';

const Login: React.FC = () => {
  const { setNotify } = React.useContext(NotificationStateContext);

  const handleCreateUser = React.useCallback(() => {
    loginByGoogleAuth();
  }, []);

  const handleSignout = React.useCallback(() => {
    signOutFromGoogleAuth();
    setNotify({
      type: 'success',
      message: 'ログアウトしました',
      open: true,
    });
  }, [setNotify]);

  return (
    <>
      <button onClick={handleCreateUser}>ログイン</button>
      <button onClick={handleSignout}>ログアウト</button>
    </>
  );
};

export default Login;
