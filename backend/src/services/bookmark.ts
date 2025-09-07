import { db } from "../lib/db";
import { bookmark } from "../db/schema";
import { uploadFileToS3 } from "../lib/s3";
import { and, eq } from "drizzle-orm";

export const createBookmark = async (data: typeof bookmark.$inferInsert) => {
	const newBookmark = await db.insert(bookmark).values(data).returning();
	return newBookmark[0];
};

export const uploadBookmark = async (
	file: Buffer,
	title: string,
	folderId: number,
	folderName: string,
	userId: string,
	username: string,
	contentType: string,
) => {
	const allowedFileTypes: Record<string, string[]> = {
		"application/pdf": [".pdf"],
		"application/msword": [".doc"],
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
			".docx",
		],
		"text/plain": [".txt"],
		"text/markdown": [".md"],
		"text/html": [".html"],
		"image/png": [".png"],
		"image/jpeg": [".jpg", ".jpeg"],
		"image/gif": [".gif"],
		"image/webp": [".webp"],
	};

	if (!allowedFileTypes[contentType]) {
		throw new Error("Unsupported file type");
	}

	const fileExtension = allowedFileTypes[contentType][0];

	const randomSuffix = Math.floor(Math.random() * 10000);

	const storageKey = `${username}-${userId}/${folderName}-${folderId}/bookmark_${Date.now()}_${randomSuffix}${fileExtension}`;

	const newBookmark = await createBookmark({
		title,
		folder_id: folderId,
		user_id: userId,
		contentType,
		storageKey,
		status: "uploading",
	});

	console.log("Created bookmark:", newBookmark);

	await uploadFileToS3(file, storageKey, contentType);

	await db
		.update(bookmark)
		.set({ status: "uploaded" })
		.where(eq(bookmark.id, newBookmark.id));

	return newBookmark;
};

export const getBookmarksInFolder = async (
	folderId: number,
	userId: string,
) => {
	const bookmarks = await db
		.select()
		.from(bookmark)
		.where(
			and(eq(bookmark.folder_id, folderId), eq(bookmark.user_id, userId)),
		);

	return bookmarks;
};
