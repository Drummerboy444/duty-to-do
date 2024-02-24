import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import Head from "next/head";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const Header = () => {
  return (
    <div className="sticky top-0 flex gap-8 bg-red-500 p-4">
      <span>HeaderItem1</span>
      <span>HeaderItem2</span>
    </div>
  );
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <Head>
        <title>Duty to do</title>
        <meta name="description" content="App to help you choose what to do" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
