import React from 'react';
import {
  loginByGoogleAuth,
  signOutFromGoogleAuth,
  useCurrentUser,
} from '../src/utils/userAuth';
import { NotificationStateContext } from './Notification';

const Navbar: React.FC = () => {
  const { setNotify } = React.useContext(NotificationStateContext);
  const currentUser = useCurrentUser();

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
      {currentUser ? (
        <button onClick={handleSignout}>ログアウト</button>
      ) : (
        <button onClick={handleCreateUser}>ログイン</button>
      )}
    </>
  );
};

export default Navbar;
