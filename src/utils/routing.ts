export const HOME_ROUTE = "/";
export const SIGN_IN_ROUTE = "/sign-in";
export const SIGN_UP_ROUTE = "/sign-up";

const isRoute = (path: string) => (route: string) => route.startsWith(path);

export const isHomeRoute = isRoute(HOME_ROUTE);
export const isSignInRoute = isRoute(SIGN_IN_ROUTE);
export const isSignUpRoute = isRoute(SIGN_UP_ROUTE);
