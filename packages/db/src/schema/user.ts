import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
	integer,
	pgTable,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

export const userTable = pgTable(
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

export type User = InferSelectModel<typeof userTable>; // return type when queried
export type NewUser = InferInsertModel<typeof userTable>; // insert type
