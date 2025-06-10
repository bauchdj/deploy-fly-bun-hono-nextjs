import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("*", cors());

app.get("/", (c) => c.json({ message: "Hello from Hono server!" }));

const port = process.env.PORT || 3000;

export default {
	port,
	fetch: app.fetch,
};
