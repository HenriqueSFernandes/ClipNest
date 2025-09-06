import { Elysia, Context } from "elysia";
import { AuthService } from "./lib/auth";
import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { sendVerificationEmail } from "./lib/email";
import { bookmarkRoutes } from "./routes/bookmark";
import { folderRoutes } from "./routes/folder";

const logger = new Elysia({ name: "logger" }).onRequest(({ request }) => {
	const { method, url } = request;
	console.log(`[${new Date().toISOString()}] ${method} ${url}`);
});

const app = new Elysia()
	.use(swagger())
	.use(
		cors({
			origin: ["http://localhost:3000", "https://app.clipnest.cloud"],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(logger)
	.use(AuthService)
	.use(bookmarkRoutes)
	.use(folderRoutes)
	.get("/user", ({ user }) => user, {
		auth: true,
	})
	.get("/health", () => ({ status: "ok" }))
	.listen(4000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
