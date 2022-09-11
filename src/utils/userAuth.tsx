import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  UserCredential,
} from 'firebase/auth';
import React from 'react';
import { useShowError } from '../hooks/error';
import { User } from '../interface';
import { auth } from './firebase';

type AuthState = {
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
const AuthContext = React.createContext<AuthState>({} as AuthState);

type Props = {
  children: React.ReactNode;
};

export const UserAuthProvider: React.FC<Props> = (props) => {
  const [currentUser, setCurrentUser] = React.useState<User>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const showError = useShowError();

  const hadnleGetCurrentUser = React.useCallback(async () => {
    try {
      setLoading(true);
      // const response = await getCurrentUser();
      // setCurrectUser(response);
    } catch (err) {
      showError(err);
    }
  }, [showError]);

  React.useEffect(() => {
    hadnleGetCurrentUser();
  }, [hadnleGetCurrentUser]);
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
