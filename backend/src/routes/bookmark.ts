import { Elysia, t } from "elysia";
import { createBookmark, uploadBookmark } from "../services/bookmark";
import { AuthService } from "../lib/auth";

export const bookmarkRoutes = new Elysia({ prefix: "/bookmarks" })
	.use(AuthService)
	.post(
		"/",
		async ({ body }) => {
			const newBookmark = await createBookmark(body);
			return newBookmark;
		},
		{
			body: t.Object({
				title: t.String(),
				url: t.Optional(t.String()),
				folder_id: t.Integer(),
				user_id: t.String(),
				storageKey: t.Optional(t.String()),
				contentType: t.Optional(t.String()),
			}),
		},
	)
	.post(
		"/upload",
		async ({ body, user }) => {
			// const { file, title, folder_id, contentType } = body;
			// TODO: update to use the folder ID
			// TODO: check if the user can actually upload to that folder
			const { file, folderName } = body;
			const title = file.name;
			const contentType = file.type;
			console.log(body, user);
			try {
				const newBookmark = await uploadBookmark(
					Buffer.from(await file.arrayBuffer()),
					title,
					// folderId,
					1,
					folderName,
					user.id,
					user.name,
					contentType,
				);
				return newBookmark;
			} catch (error) {
				return { error: (error as Error).message };
			}
		},
		{
			auth: true,
			body: t.Object({
				file: t.File(),
				// title: t.String(),
				folderName: t.String(),
				// contentType: t.String(),
			}),
		},
	);
