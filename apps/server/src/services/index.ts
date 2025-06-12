import { db } from "@demo/db";
import { userTable, type NewUser, type User } from "@demo/db/schema/user";
import { isDbConnected } from "@demo/db/utils";

export async function service() {
	const helloWorld = buildMessage("World");
	if (!(await isDbConnected())) {
		return helloWorld;
	}

	const result: User[] = await db.select().from(userTable).limit(1);
	const user: User | undefined = result[0];

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
