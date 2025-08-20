import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { relations } from "drizzle-orm";
import { bookmark } from "./bookmark";

export const folder = pgTable("folder", {
  id: serial("id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

export const folderRelations = relations(folder, ({ one, many }) => ({
  user: one(user, {
    fields: [folder.user_id],
    references: [user.id],
  }),
  bookmarks: many(bookmark),
}));
