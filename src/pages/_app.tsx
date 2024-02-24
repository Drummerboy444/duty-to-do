import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider, useTheme } from "next-themes";
import { type AppType } from "next/app";
import Head from "next/head";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const Header = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="sticky top-0 flex gap-8 bg-red-500 p-4 dark:bg-purple-500">
      <span>HeaderItem1</span>
      <span>HeaderItem2</span>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
};

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class">
        <Head>
          <title>Duty to do</title>
          <meta
            name="description"
            content="App to help you choose what to do"
          />
          <link
            href="light-mode-favicon.svg"
            rel="icon"
            media="(prefers-color-scheme: light)"
          />
          <link
            href="dark-mode-favicon.svg"
            rel="icon"
            media="(prefers-color-scheme: dark)"
          />
        </Head>

        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
