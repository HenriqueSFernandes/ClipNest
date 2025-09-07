import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set in environment variables");
}

export default defineConfig({
	out: "./src/drizzle",
	casing: "snake_case",
	schema: "./src/db/schema",
	dialect: "postgresql",
	dbCredentials: {
		url: databaseUrl,
	},
});
