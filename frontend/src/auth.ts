import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { SIGN_IN } from "./app/graphQl/tanstackMutations/userMutations";

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

          try {
            const response = await fetch('http://localhost:4000/graphql',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                query: SIGN_IN,
                variables: { email, password }
              })
            });

            const { data } = await response.json();


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

          catch (error: unknown) {
           console.log(error);
           return null
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
    trustHost: process.env.NODE_ENV === "production"?true:true
  })