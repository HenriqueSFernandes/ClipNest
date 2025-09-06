import {
	integer,
	json,
	pgTable,
	serial,
	text,
	timestamp,
	pgEnum,
} from "drizzle-orm/pg-core";
import { folder } from "./folder";
import { user } from "./auth";
import { relations } from "drizzle-orm";
import { bookmarkChunk } from "./bookmark_chunk";

export const statusEnum = pgEnum("status", [
	"created",
	"uploading",
	"uploaded",
	"extracting_data",
	"data_extracted",
	"creating_embeddings",
	"done",
]);

export const bookmark = pgTable("bookmark", {
	id: serial("id").primaryKey(),
	folder_id: integer("folder_id")
		.notNull()
		.references(() => folder.id, { onDelete: "cascade" }),
	user_id: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	url: text("url"),
	storageKey: text("storage_key"),
	contentType: text("content_type"),
	status: statusEnum("status").default("created"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const bookmarkRelations = relations(bookmark, ({ one, many }) => ({
	folder: one(folder, {
		fields: [bookmark.folder_id],
		references: [folder.id],
	}),
	user: one(user, {
		fields: [bookmark.user_id],
		references: [user.id],
	}),
	chunks: many(bookmarkChunk),
}));
