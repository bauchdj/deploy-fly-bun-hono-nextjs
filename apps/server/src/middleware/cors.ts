import { config } from "@deploy-fly-bun-hono-nextjs/config";
import { cors } from "hono/cors";

export const corsMiddleware = cors({
	origin: config.env.NEXT_PUBLIC_WEB_URL,
	credentials: true,
	allowHeaders: ["Content-Type", "Authorization"],
	allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});
