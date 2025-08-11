import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", "http://localhost:4000", "https://clipnest.rickyf.duckdns.org/api", "https://clipnest.rickyf.duckdns.org"],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
