import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type AuthOptions } from "next-auth";
import customAxios from "@/lib/axios";
import { User } from "@/lib/types/User";
import { isAxiosError } from "axios";

export const authOptions: AuthOptions = {
  // because my backend is in a different project folder, i need to make an axios request

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const baseURL =
          process.env.NEXT_PUBLIC_API_URL === "/api"
            ? `${process.env.NEXTAUTH_URL}/api` // NEXTAUTH_URL is required in NextAuth for server
            : process.env.NEXT_PUBLIC_API_URL;
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await customAxios.post(`${baseURL}/users/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          // get the user
          const user = res.data.user as User;
          //get the jwt token
          const token = res.data.token;
          if (user && token) {
            return { ...user, accessToken: token };
          }
          return null;
        } catch (err) {
          if (isAxiosError(err)) {
            console.log(err.response?.data);
          } else {
            console.log(err);
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    // NextAuth adds the user data inside a JWT
    // sets a cookie called next-auth.session-token
    // stores the user info inside
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Cast to my custom User, override the default nextauth user
        const u = user as User;

        token.id = u.id;
        token.email = u.email;
        token.username = u.username;
        // save token to jwt
        token.accessToken = u.accessToken ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
