import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NotificationProvider } from '../components/Notification';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </>
  );
};

export default MyApp;
