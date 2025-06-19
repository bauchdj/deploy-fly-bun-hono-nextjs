import { config } from "@deploy-fly-bun-hono-nextjs/config";
import { Redis } from "iovalkey";

const redisClient = new Redis({
	port: Number(config.env.VALKEY_PORT),
	host: config.env.VALKEY_HOST,
	username: config.env.VALKEY_USERNAME,
	password: config.env.VALKEY_PASSWORD,
});

redisClient.on("error", err => {
	console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
	console.log("Connected to Valkey");
});

export default redisClient;
