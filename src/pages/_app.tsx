import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider, useTheme } from "next-themes";
import { type AppType } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { type PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { Button } from "~/components/Button";
import { useMounted } from "~/hooks/use-mounted";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import { isSignInRoute, isSignUpRoute } from "~/utils/routing";

const Header = () => {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) return undefined;

  return (
    <div className="sticky top-0 flex min-h-16 gap-2 bg-white p-4 dark:bg-zinc-900">
      <Button
        onClick={() => {
          if (theme === "light") {
            setTheme("dark");
          } else if (theme === "dark") {
            setTheme("system");
          } else {
            setTheme("light");
          }
        }}
        label={`Theme: ${theme}`}
      />

      <div className="grow" />

      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

const ClerkWrapper = ({ children }: PropsWithChildren) => {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      {...(resolvedTheme === "dark" ? { appearance: { baseTheme: dark } } : {})}
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 5_000,
          ...(resolvedTheme === "dark"
            ? {
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }
            : {}),
        }}
      />
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
