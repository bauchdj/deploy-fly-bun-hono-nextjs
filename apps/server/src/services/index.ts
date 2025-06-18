import { userTable, type NewUser, type User } from "@deploy-fly-bun-hono-nextjs/db/schema/user";
import { isDbConnected } from "@deploy-fly-bun-hono-nextjs/db/utils";
import { db } from "@deploy-fly-bun-hono-nextjs/db";

export async function service() {
	const helloWorld = buildMessage("World");
	if (!(await isDbConnected())) {
		return helloWorld;
	}

	const user: User | undefined = await db.query.userTable.findFirst();

	if (user) {
		return buildMessage(user.name);
	} else {
		const newUser = await insertUser();
		return buildMessage(newUser.name);
	}
}

async function insertUser() {
	const newUser: NewUser = {
		name: "Hono",
		username: "hono",
		email: "hono@hono.com",
	};

	await db.insert(userTable).values(newUser);

	return newUser;
}

function buildMessage(name: string) {
	return `Hello ${name}!`;
}
