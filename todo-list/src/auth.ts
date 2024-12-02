import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SIGN_IN } from "./app/graphQl/mutations/userMutations";
import client from "./lib/apolloClient";

export const { handlers, auth, signOut, signIn } = NextAuth(
  {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }),
      CredentialsProvider({
        name: "Credentials",
        authorize: async (credentials) => {
          const { email, password } = credentials as { email: string; password: string };

          if (!email || !password) {
            console.error("Missing email or password");
            return null; // Return null for missing credentials
          }

          // try {
          //   const response = await axios.post(
          //     `${process.env.API_URL || "http://localhost:3000"}/api/signin`,
          //     { email, password },
          //     {
          //       headers: { "Content-Type": "application/json" },
          //     }
          //   );

          //   // Extract user data from response
          //   const user = response.data.user;


          //   // Validate response and user structure
          //     if (response.status === 200 && user && user.email && user.id) {
          //       return {
          //         name: user.username,
          //         email: user.email,
          //         id: user.id
          //       }; // Return user on successful authentication
          //   } 
          //     else {
          //       console.warn("Unexpected response structure:", response);
          //       return null;
          //   }
          // } 


          try {
            const { data } = await client.mutate({
              mutation: SIGN_IN,
              variables: { email, password },
            });

            const { user, token } = data?.signIn || {};

            if (user && token) {
              console.log("Sign-in successful:", user);
              return {
                name: user.username,
                email: user.email,
                id: user.id,
                token,
              };
            } 
            else {
              console.warn("Unexpected response structure:", data);
              return null;
            }
          }

          catch (error: any) {
            if (error.networkError) 
              {
              console.error("Network error:", error.networkError);
            } 
            else if (error.graphQLErrors) {
              console.error("GraphQL errors:", error.graphQLErrors);
            } 
            else {
              console.error("Unexpected error:", error);
            }
            return null;
          }
        }
      }),

    ],

    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.user = user.name;
          token.email = user.email;
          token.id = user.id;
        }
        // console.log("JWT callback:", { token, user });
        return token;
      },
      async session({ session, token }) {
        session.user = {
          name: token.user as string,
          email: token.email as string,
          id: token.id as string,
          emailVerified: null,
        }
        // console.log("Session callback:", session);
        return session;
      },
    },

    pages: {
      signIn: '/signin'
    },
    session: {
      strategy: "jwt",
    },
    debug: process.env.NODE_ENV === "development",
  })