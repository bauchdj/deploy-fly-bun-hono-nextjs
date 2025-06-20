import { config } from "@deploy-fly-bun-hono-nextjs/config";
import { getHostnameFamily } from "./utils/hostname-family";
import { Redis } from "iovalkey";

async function redisClientInstance() {
	const family = await getHostnameFamily(config.env.VALKEY_HOST);
	if (!family) {
		console.error("Failed to resolve hostname");
		process.exit(1);
	}

	const redisClient = new Redis({
		family,
		port: Number(config.env.VALKEY_PORT),
		host: config.env.VALKEY_HOST,
		username: config.env.VALKEY_USERNAME,
		password: config.env.VALKEY_PASSWORD,
	});

	redisClient.on("error", err => {
		console.error("Redis connection error:", err);
	});

	redisClient.on("connect", () => {
		console.log(`Connected to Valkey over ${family === 4 ? "IPv4" : "IPv6"}`);
	});

	return redisClient;
}

const redisClient = await redisClientInstance();

export default redisClient;
