import { ClerkProvider, UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
  HomeIcon,
  LaptopIcon,
  LockClosedIcon,
  LockOpen1Icon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { ThemeProvider, useTheme } from "next-themes";
import { type AppType } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { type PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { useMounted } from "~/hooks/use-mounted";
import { useSafeActivityCollectionQueryParams } from "~/hooks/use-safe-query-params";
import "~/styles/globals.css";
import { api } from "~/utils/api";
import { isAdmin } from "~/utils/is-admin";
import {
  ACCOUNT_ROUTE,
  ADMIN_ROUTE,
  HOME_ROUTE,
  SIGN_IN_ROUTE,
  getActivityCollectionEditRoute,
  getActivityCollectionRoute,
  isAccountRoute,
  isAdminRoute,
  isEditRoute,
  isSignInRoute,
  isSignUpRoute,
} from "~/utils/routing";

const BreadCrumbSlash = () => (
  <p className="select-none text-2xl font-bold text-gray-300 dark:text-zinc-700">
    /
  </p>
);

const BreadCrumbs = () => {
  const { route } = useRouter();
  const queryParams = useSafeActivityCollectionQueryParams();

  const { data } = api.activityCollections.get.useQuery(
    queryParams !== "LOADING" && queryParams !== "QUERY_PARAMS_UNAVAILABLE"
      ? { id: queryParams.requiredKeysLookup.activityCollectionId }
      : { id: "" },
    {
      enabled:
        queryParams !== "LOADING" && queryParams !== "QUERY_PARAMS_UNAVAILABLE",
    },
  );

  return (
    <>
      <Link href={HOME_ROUTE}>
        <HomeIcon />
      </Link>

      {isAccountRoute(route) && (
        <>
          <BreadCrumbSlash />
          <Link href={ACCOUNT_ROUTE}>Account</Link>
        </>
      )}

      {data !== undefined && data.type === "SUCCESS" && (
        <>
          <BreadCrumbSlash />
          <Link href={getActivityCollectionRoute(data.activityCollection.id)}>
            {data.activityCollection.name}
          </Link>
          {isEditRoute(route) && (
            <>
              <BreadCrumbSlash />
              <Link
                href={getActivityCollectionEditRoute(
                  data.activityCollection.id,
                )}
              >
                Edit
              </Link>
            </>
          )}
        </>
      )}
    </>
  );
};

const AdminButton = () => {
  const { user, isLoaded: userIsLoaded } = useUser();
  const { route } = useRouter();

  if (!userIsLoaded) return undefined;

  if (user === null) return undefined;

  if (!isAdmin(user.publicMetadata)) return undefined;

  return (
    <Link href={ADMIN_ROUTE}>
      {isAdminRoute(route) ? <LockOpen1Icon /> : <LockClosedIcon />}
    </Link>
  );
};

const Header = () => {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  return (
    <div className="sticky top-0 z-10 flex min-h-16 flex-wrap items-center gap-4 bg-white p-4 dark:bg-zinc-900">
      <BreadCrumbs />

      <div className="grow" />

      <AdminButton />

      {mounted && (
        <>
          {theme === "light" && (
            <button
              onClick={() => {
                setTheme("dark");
              }}
            >
              <SunIcon className="hover:cursor-pointer" />
            </button>
          )}

          {theme === "dark" && (
            <button
              onClick={() => {
                setTheme("system");
              }}
            >
              <MoonIcon className="hover:cursor-pointer" />
            </button>
          )}

          {theme === "system" && (
            <button
              onClick={() => {
                setTheme("light");
              }}
            >
              <LaptopIcon className="hover:cursor-pointer" />
            </button>
          )}
        </>
      )}

      <UserButton
        afterSignOutUrl={SIGN_IN_ROUTE}
        userProfileMode="navigation"
        userProfileUrl={ACCOUNT_ROUTE}
      />
    </div>
  );
};

const ClerkWrapper = ({
  children,
  pageProps,
}: PropsWithChildren & { pageProps: object }) => {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      {...(resolvedTheme === "dark" ? { appearance: { baseTheme: dark } } : {})}
      {...pageProps}
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
      <ClerkWrapper pageProps={pageProps}>
        <Head>
          <title>Duty to do</title>
          <meta
            name="description"
            content="App to help you choose what to do"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {!isSignInRoute(route) && !isSignUpRoute(route) && <Header />}
        <Component {...pageProps} />
      </ClerkWrapper>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
