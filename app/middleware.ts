import { withAuth } from "next-auth/middleware";

// since i'm using a custom login page, i need to explicitly tell the middleware where it is. Otherwise it would use the nextauth login page, and i'd get a 404 when the session expires
export default withAuth({
  pages: {
    signIn: "/user-login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/update",
    "/import/:path*",
    "/export/:path*",
  ],
};

// middleware only knows if the cookie token exists
