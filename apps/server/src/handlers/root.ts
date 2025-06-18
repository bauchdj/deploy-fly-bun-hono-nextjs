import { Hono } from "hono";

const app = new Hono();

const rootHandler = app.get("/", c => c.text("Hello World"));

export type RootHandler = typeof rootHandler;

export default app;
