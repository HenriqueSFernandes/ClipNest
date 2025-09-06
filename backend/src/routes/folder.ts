import { Elysia, t } from "elysia";

import { AuthService } from "../lib/auth";
import { createFolder, getFoldersForUser } from "../services/folder";

export const folderRoutes = new Elysia({ prefix: "/folders" })
	.use(AuthService)
	.get(
		"/",
		async ({ user }) => {
			const res = await getFoldersForUser(user.id);
			return res;
		},
		{
			auth: true,
		},
	)
	.post(
		"/",
		async ({ body, user }) => {
			const { name } = body;

			try {
				const newFolder = await createFolder(user.id, name);
				return newFolder;
			} catch (error) {
				return { error: (error as Error).message };
			}
		},
		{
			auth: true,
			body: t.Object({
				name: t.String(),
			}),
		},
	);
