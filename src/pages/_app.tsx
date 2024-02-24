import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import "~/styles/globals.css";
import { api } from "~/utils/api";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const localStorageValue = window.localStorage.getItem("is-dark-mode");
    if (localStorageValue !== null) {
      if (localStorageValue === "t") {
        return true;
      } else {
        return false;
      }
    } else {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDarkMode) {
        return true;
      } else {
        return false;
      }
    }
  });

  return (
    <div className="sticky top-0 flex gap-8 bg-red-500 p-4">
      <span>HeaderItem1</span>
      <span>HeaderItem2</span>
      <input
        type="checkbox"
        checked={isDarkMode}
        onClick={() => {
          setIsDarkMode(!isDarkMode);
          window.localStorage.setItem("is-dark-mode", !isDarkMode ? "t" : "f");
          if (!isDarkMode) {
            document.querySelector("html")?.classList.add("dark");
          } else {
            document.querySelector("html")?.classList.remove("dark");
          }
        }}
        onChange={() => {
          // This is to avoid a console error as we're using onClick instead of onChange.
        }}
      />
      <button
        onClick={() => {
          localStorage.removeItem("is-dark-mode");
          const prefersDarkMode = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;
          if (prefersDarkMode) {
            setIsDarkMode(true);
            document.querySelector("html")?.classList.add("dark");
          } else {
            setIsDarkMode(false);
            document.querySelector("html")?.classList.remove("dark");
          }
        }}
      >
        Prefer system theme
      </button>
    </div>
  );
};

const MyApp: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    const localStorageValue = window.localStorage.getItem("is-dark-mode");
    if (localStorageValue !== null) {
      if (localStorageValue === "t") {
        document.querySelector("html")?.classList.add("dark");
      } else {
        document.querySelector("html")?.classList.remove("dark");
      }
    } else {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDarkMode) {
        document.querySelector("html")?.classList.add("dark");
      } else {
        document.querySelector("html")?.classList.remove("dark");
      }
    }
  }, []);

  return (
    <ClerkProvider>
      <Head>
        <title>Duty to do</title>
        <meta name="description" content="App to help you choose what to do" />
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
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
