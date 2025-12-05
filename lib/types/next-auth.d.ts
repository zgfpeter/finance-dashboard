import NextAuth from "next-auth";
import { jwt } from "next-auth/jwt";
// define my own User type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      accessToken: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    username: string;
    email: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  // returned by the jwt calback and getToken when using JWT sessions
  interface JWT {
    id: string;
    username: string;
    emal: string;
    accessToken: string;
  }
}
