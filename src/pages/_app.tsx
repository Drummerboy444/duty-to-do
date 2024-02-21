import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import Head from "next/head";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <Head>
        <title>Duty to do</title>
        <meta name="description" content="App to help you choose what to do" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
