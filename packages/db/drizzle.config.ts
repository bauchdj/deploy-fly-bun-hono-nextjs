import { config } from "@deploy-fly-bun-hono-nextjs/config";
import { defineConfig } from "drizzle-kit";

const url = config.env.DATABASE_URL;

const drizzleConfig = defineConfig({
	out: "./drizzle",
	schema: "./src/schema/*",
	dialect: "postgresql",
	dbCredentials: {
		url,
	},
});

export default drizzleConfig;
