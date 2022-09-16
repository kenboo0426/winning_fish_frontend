import { useRouter } from 'next/router';
import React from 'react';
import Login from '../components/organisms/Login';
import { useCurrentUser } from '../src/utils/userAuth';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();

  React.useEffect(() => {
    if (currentUser) router.push('/');
  }, [router, currentUser]);

  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;
