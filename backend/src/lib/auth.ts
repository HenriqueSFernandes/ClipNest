import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { sendVerificationEmail } from "./email";
import "dotenv/config";

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
		requireEmailVerification: false,
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
});
