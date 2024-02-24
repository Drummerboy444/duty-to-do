import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider, useTheme } from "next-themes";
import { type AppType } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { type PropsWithChildren } from "react";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import { isSignInRoute, isSignUpRoute } from "~/utils/routing";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="sticky top-0 flex gap-8 bg-white p-4 dark:bg-zinc-900">
      <UserButton afterSignOutUrl="/" />

      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={theme === "light"}
          onChange={() => {
            setTheme("light");
          }}
        />
        <span>Light</span>
      </div>

      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={() => {
            setTheme("dark");
          }}
        />
        <span>Dark</span>
      </div>

      <div className="flex gap-2">
        <input
          type="checkbox"
          checked={theme === "system"}
          onChange={() => {
            setTheme("system");
          }}
        />
        <span>System</span>
      </div>
    </div>
  );
};

const ClerkWrapper = ({ children }: PropsWithChildren) => {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      {...(resolvedTheme === "dark" ? { appearance: { baseTheme: dark } } : {})}
    >
      {children}
    </ClerkProvider>
  );
};

const MyApp: AppType = ({ Component, pageProps }) => {
  const { route } = useRouter();

  return (
    <ThemeProvider attribute="class">
      <ClerkWrapper>
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
        {!isSignInRoute(route) && !isSignUpRoute(route) && <Header />}
        <Component {...pageProps} />
      </ClerkWrapper>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
