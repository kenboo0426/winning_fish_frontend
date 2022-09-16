import 'bootstrap/dist/css/bootstrap.min.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { NotificationProvider } from '../components/organisms/Notification';
import {
  useCurrentUser,
  useCurrentUserLoading,
  UserAuthProvider,
} from '../src/utils/userAuth';
import React from 'react';
import { useRouter } from 'next/router';
import { WebSocketProvider, WebSocketContext } from '../src/utils/webSocket';
import TopNavbar from '../components/organisms/TopNavBar';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <div>
      <Head>
        <title>Winning Fish</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
          integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
          crossOrigin="anonymous"
        />
      </Head>
      <NotificationProvider>
        <UserAuthProvider>
          <WebSocketProvider>
            <MyappInit />
            <TopNavbar />
            <Component {...pageProps} />
          </WebSocketProvider>
        </UserAuthProvider>
      </NotificationProvider>
    </div>
  );
};

const MyappInit: React.FC = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const currentUserLoading = useCurrentUserLoading();
  const { socketrefCurrent, onlinMatchStatus, isConnected } =
    React.useContext(WebSocketContext);

  console.log(onlinMatchStatus, 'onlinMatchStatusonlinMatchStatus');

  // React.useEffect(() => {
  //   if (!currentUserLoading && !currentUser) {
  //     router.push('/login');
  //   }
  // }, [router, currentUser, currentUserLoading]);

  return null;
};

export default MyApp;
