import "../styles/globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
