import { nanoid } from "nanoid";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const blogs = pgTable("blogs", {
    id: text("id").primaryKey().$defaultFn(() => nanoid()),
    title: text("title").notNull(),
    topic: text("topic").notNull(),
    content: text("content").notNull(),
    image: text("image"),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});