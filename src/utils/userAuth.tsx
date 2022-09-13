import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  UserCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import React from 'react';
import { NotificationStateContext } from '../../components/Notification';
import { show, create } from '../api/user';
import { User } from '../interface';
import { auth } from './firebase';

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
  const [loading, setLoading] = React.useState<boolean>(false);
  const { setNotify } = React.useContext(NotificationStateContext);

  React.useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (!user && currentUser) {
        setCurrentUser(null);
      } else if (user && !currentUser) {
        const params = {
          uuid: user.uid,
          name: user.displayName!,
          email: user.email!,
        };
        const response = await create(params);
        setCurrentUser(response);
        setNotify({
          type: 'success',
          message: 'ログインしました',
          open: true,
        });
      }
      setLoading(false);
    });
  }, [currentUser, setNotify]);

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

export const useFetchCurrentUser = () => {
  const { setCurrentUser } = React.useContext(AuthContext);
  const currentUser = useCurrentUser();
  const fetchCurrentUser = React.useCallback(async () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user && currentUser) {
        setCurrentUser(null);
      } else if (user && !currentUser) {
        const response = await show(user.uid);
        setCurrentUser(response);
      }
    });
  }, [setCurrentUser, currentUser]);

  return fetchCurrentUser;
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