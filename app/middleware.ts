export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*"],
};

// middleware only knows if the cookie token exists
