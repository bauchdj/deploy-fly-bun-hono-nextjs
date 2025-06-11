import { config } from "@nimbus/config";
import { db } from "@nimbus/db";
import { user } from "@nimbus/db/schema/user";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors({ origin: "*" }));

app.get("/hello", async (c) => {
	const result = await db.select().from(user).limit(1);
	const name = result[0]?.name || "World";
	return c.text(`Hello ${name}!`);
});

const honoConfig = {
	port: config.env.SERVER_PORT,
	fetch: app.fetch,
};
export default honoConfig;
