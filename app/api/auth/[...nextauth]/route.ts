import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type AuthOptions } from "next-auth";
import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await axios.post(`${apiUrl}/api/users/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const user = res.data.user;
          return user || null;
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.log(err.response?.data);
          } else {
            console.log(err);
          }
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
