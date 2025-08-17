import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { sendVerificationEmail } from "./email";

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:4000",
    "https://api.clipnest.cloud",
    "https://clipnest.cloud",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
		requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendVerificationEmail({
        userName: user.name,
        userEmail: user.email,
        verificationUrl: url,
      });
    },
  },
});
