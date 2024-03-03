export const HOME_ROUTE = "/";
export const SIGN_IN_ROUTE = "/sign-in";
export const SIGN_UP_ROUTE = "/sign-up";
export const ACCOUNT_ROUTE = "/account";

const startsWith = (path: string) => (route: string) => route.startsWith(path);

export const isSignInRoute = startsWith(SIGN_IN_ROUTE);
export const isSignUpRoute = startsWith(SIGN_UP_ROUTE);
export const isAccountRoute = startsWith(ACCOUNT_ROUTE);

export const getActivityCollectionRoute = (activityCollectionId: string) =>
  `/${activityCollectionId}`;
