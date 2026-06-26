import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "../db";

const betterAuthSecret =
  process.env.BETTER_AUTH_SECRET ??
  "dev_7C4nGk2mX9pQ6rT8vB1sD5fH3jL0zY2w";
const betterAuthUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? betterAuthUrl;
const googleCredentials =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : undefined;

export const auth = betterAuth({
  appName: "Pangan Insight Indonesia",
  baseURL: betterAuthUrl,
  secret: betterAuthSecret,

  user: {
    additionalFields: {
      phoneNumber: {
        type: "number",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
  },

  ...(googleCredentials ? { socialProviders: googleCredentials } : {}),

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  // plugins: [...authorizationPlugins],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
      strategy: "compact",
    },
    deferSessionRefresh: true,
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24,
  },

  trustedOrigins: [
    appUrl,
    betterAuthUrl,
  ],
});
