import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type AuthOptions } from "next-auth";
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // here credentials.email is whatever the user typed in the form email field
        // password is whatever the user typed in the form password field

        // Look up the user in the database
        // Validate password
        // Return user object if valid, otherwise return null
        const testUser = {
          id: "123",
          name: "testUser",
          email: "testUser@example.com",
          password: "Abc123", // FIX WITH REAL USER DATABASE
        };
        if (
          credentials.email === testUser.email &&
          credentials.password === testUser.password
        ) {
          return {
            id: testUser.id,
            name: testUser.name,
            email: testUser.email,
          };
        }
        return null;
        // if authorize() returns a user, NextAuth creates the session
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    // NextAuth adds the user data inside a JWT
    // sets a cookie called next-auth.session-token
    // stores the user info inside
  },
  // using as const p
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
