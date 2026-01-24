const routes = {
  home: "/",
  bonus: "/bonus",
} as const;

export const protectedRoutes: string[] = []; // for exmaple: routes.dashboard
export const nonProtectedRoutes: string[] = [];

export default routes;
