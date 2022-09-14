import { useRouter } from 'next/router';
import React from 'react';
import SignUp from '../components/SignUp';
import { useCurrentUser } from '../src/utils/userAuth';

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const currentUser = useCurrentUser();

  React.useEffect(() => {
    if (currentUser) router.push('/');
  }, [router, currentUser]);

  return (
    <>
      <SignUp />
    </>
  );
};

export default SignUpPage;
