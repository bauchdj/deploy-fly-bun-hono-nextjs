import { rateLimiterMiddleware } from "./middleware/rate-limiter";
import { config } from "@deploy-fly-bun-hono-nextjs/config";
import { corsMiddleware } from "./middleware/cors";
import health from "./handlers/health";
import hello from "./handlers/hello";
import root from "./handlers/root";
import { Hono } from "hono";

const app = new Hono();

app.use(corsMiddleware);
app.use(rateLimiterMiddleware);

app.route("/", root);
app.route("/", health);
app.route("/", hello);

const honoConfig = {
	port: config.env.SERVER_PORT,
	fetch: app.fetch,
};
export default honoConfig;
