import controller from "@/controllers";
import { corsMiddleware } from "@/middleware";
import { config } from "@demo/config";
import { Hono } from "hono";

const app = new Hono();

app.use(corsMiddleware);

app.route("/", controller);

const honoConfig = {
	port: config.env.SERVER_PORT,
	fetch: app.fetch,
};
export default honoConfig;
