import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors({ origin: "*" }));

app.get("/hello-hono", (c) => {
	return c.text("Hello Hono!");
});

export default {
	port: 1284,
	fetch: app.fetch,
};
