import {
	integer,
	pgTable,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable(
	"user",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),
		name: varchar({ length: 255 }).notNull(),
		username: varchar({ length: 255 }).notNull().unique(),
		email: varchar({ length: 255 }).notNull().unique(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		uniqueIndex("username_idx").on(table.username),
		uniqueIndex("email_idx").on(table.email),
	]
);
