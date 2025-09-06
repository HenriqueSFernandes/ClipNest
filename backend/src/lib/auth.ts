import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email";
import "dotenv/config";
import Elysia from "elysia";

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:4000",
    "https://api.clipnest.cloud",
    "https://app.clipnest.cloud",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendPasswordResetEmail({
        url,
        userName: user.name,
        userEmail: user.email,
      });
    },
  },
  // emailVerification: {
  // 	sendVerificationEmail: async ({ user, url, token }, request) => {
  // 		await sendVerificationEmail({
  // 			verificationUrl: url,
  // 			// callbackUrl: process.env.BASE_FRONTEND_URL + "/auth/verify-email",
  // 			userName: user.name,
  // 			userEmail: user.email,
  // 		});
  // 	},
  // },
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.NODE_ENV === "production" ? ".clipnest.cloud" : "localhost",
    },
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
});

export const AuthService = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({
          headers,
        });

        if (!session) return status(401);

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
