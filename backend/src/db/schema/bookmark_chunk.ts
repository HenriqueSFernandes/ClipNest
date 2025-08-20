import {
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { bookmark } from "./bookmark";
import { relations } from "drizzle-orm";

export const bookmarkChunk = pgTable("bookmark_chunk", {
  id: serial("id").primaryKey(),
  bookmark_id: integer("bookmark_id")
    .notNull()
    .references(() => bookmark.id, { onDelete: "cascade" }),
  chunkIndex: integer("chunk_index").notNull(),
  embedding: json("embedding"),
  storageKey: text("storage_key"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookmarkChunkRelations = relations(bookmarkChunk, ({ one }) => ({
  bookmark: one(bookmark, {
    fields: [bookmarkChunk.bookmark_id],
    references: [bookmark.id],
  }),
}));
