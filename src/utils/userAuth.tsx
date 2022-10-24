import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  UserCredential,
} from 'firebase/auth';
import React from 'react';
import { NotificationStateContext } from '../../components/organisms/Notification';
import { create } from '../api/user';
import { User } from '../interface';
import { auth } from './firebase';
import Cookie from 'js-cookie';
import { useShowError } from '../hooks/error';

type AuthState = {
  currentUser: User | undefined | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const AuthContext = React.createContext<AuthState>({} as AuthState);

type Props = {
  children: React.ReactNode;
};

export const UserAuthProvider: React.FC<Props> = (props) => {
  const [currentUser, setCurrentUser] = React.useState<
    User | undefined | null
  >();
  const [loading, setLoading] = React.useState<boolean>(true);
  const { setNotify } = React.useContext(NotificationStateContext);
  const showError = useShowError();

  const findOrCreateGuestUser = React.useCallback(
    async (user_cookie_id: string) => {
      try {
        const params = {
          uuid: user_cookie_id,
          name: 'ゲスト',
          email: '',
          icon: '',
          role: 2,
        };
        const { data, status } = await create(params);
        setCurrentUser(data);
        if (status == 201) {
          setNotify({
            type: 'success',
            message: 'ログインしました',
            open: true,
          });
        }
      } catch (err) {
        showError(err);
      }
    },
    [showError, setNotify]
  );

  React.useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (!user && currentUser && currentUser.role != 2) {
        setCurrentUser(null);
      } else if (user && !currentUser) {
        const params = {
          uuid: user.uid,
          name: user.displayName!,
          email: user.email!,
          icon: user.photoURL!,
          role: 0,
        };
        const { data, status } = await create(params);
        setCurrentUser(data);
        if (status == 201) {
          setNotify({
            type: 'success',
            message: 'ログインしました',
            open: true,
          });
        }
      }
      setLoading(false);
    });
  }, [currentUser, setNotify]);

  React.useEffect(() => {
    if (!currentUser && !loading && Cookie.get('guest_user_id')) {
      const user_cookie_id = Cookie.get('guest_user_id') as string;
      findOrCreateGuestUser(user_cookie_id);
    }
  }, [findOrCreateGuestUser, currentUser, loading]);

  return (
    <>
      <AuthContext.Provider
        value={{ currentUser, setCurrentUser, loading, setLoading }}
      >
        {props.children}
      </AuthContext.Provider>
    </>
  );
};

export const useCurrentUser = () => {
  return React.useContext(AuthContext).currentUser;
};

export const loginByGoogleAuth = async (): Promise<UserCredential | null> => {
  const provider = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
  return await getRedirectResult(auth);
};

export const signOutFromGoogleAuth = async () => {
  signOut(auth);
};

export const useCurrentUserLoading = () => {
  return React.useContext(AuthContext).loading;
};
