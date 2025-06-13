import handlers from "@/handlers";
import { corsMiddleware } from "@/middleware";
import { config } from "@demo/config";
import { Hono } from "hono";

const app = new Hono();

app.use(corsMiddleware);

const route = app.route("/", handlers);

export type AppType = typeof route;

const honoConfig = {
	port: config.env.SERVER_PORT,
	fetch: app.fetch,
};
export default honoConfig;
