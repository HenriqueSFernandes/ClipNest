import { Elysia, Context } from "elysia";
import { auth } from "./lib/auth";
import { cors } from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";

const betterAuth = new Elysia({ name: "better-auth" })
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
const app = new Elysia()
  .use(swagger())
  .use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(
    cors({
      origin: "https://clipnest.rickyf.duckdns.org",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(betterAuth)
  .get("/user", ({ user }) => user, {
    auth: true,
  })
  .get("/health", () => ({ status: "ok" }))
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
