import { eq } from "drizzle-orm";
import { folder } from "../db/schema";
import { db } from "../lib/db";

export const getFoldersForUser = async (userId: string) => {
	return await db.query.folder.findMany({
		where: eq(folder.user_id, userId),
	});
};

export const createFolder = async (
	userId: string,
	name: string,
	description?: string,
) => {
	const newFolder = await db
		.insert(folder)
		.values({
			user_id: userId,
			name,
			description,
		})
		.returning();
	return newFolder[0];
};
