import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

import prisma from "@/lib/prisma";

if (!process.env.GOOGLE_CLIENT_ID)
  throw new Error("GOOGLE_CLIENT_ID is not defined");
if (!process.env.GOOGLE_CLIENT_SECRET)
  throw new Error("GOOGLE_CLIENT_SECRET is not defined");
if (!process.env.NEXTAUTH_SECRET)
  throw new Error("NEXTAUTH_SECRET is not defined");
if (!process.env.NEXTAUTH_JWT_SECRET)
  throw new Error("NEXTAUTH_JWT_SECRET is not defined");

async function refreshAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: `${process.env.GOOGLE_CLIENT_ID}`,
        client_secret: `${process.env.GOOGLE_CLIENT_SECRET}`,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  secret: `${process.env.NEXTAUTH_SECRET}`,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "exmaple@gmail.com",
        },
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const userExists = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!userExists) {
          throw new Error("Email not found");
        }

        const passwordMatch = await bcryptjs.compare(
          credentials.password,
          userExists.password
        );

        if (!passwordMatch) {
          throw new Error("Password is incorrect");
        }
        const user = {
          id: userExists.id,
          email: userExists.email,
          name: userExists.username,
          image: userExists.image,
        };
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_at * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      if (account?.provider === "credentials" && user) {
        return {
          user,
        };
      }

      if (
        account?.provider === "google" &&
        Date.now() < token.accessTokenExpires
      ) {
        return token;
      }
      if (account?.provider === "google") return refreshAccessToken(token);
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      if (token.error) {
        session.error = token.error;
      }

      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        if (user) {
          return true;
        } else {
          return "/auth/signup";
        }
      } else {
        return true;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: `${process.env.NEXTAUTH_JWT_SECRET}`,
  },
};

export default NextAuth(authOptions);
