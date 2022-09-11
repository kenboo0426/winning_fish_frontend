import { useRouter } from 'next/router';
import React from 'react';
import Login from '../components/Login';
import { useCurrentUser } from '../src/utils/userAuth';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();

  if (currentUser) router.push('/');
  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;
