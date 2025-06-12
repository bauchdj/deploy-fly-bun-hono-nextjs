import { config } from "@demo/config";
import { defineConfig } from "drizzle-kit";

const drizzleConfig = defineConfig({
	out: "./drizzle",
	schema: "./src/schema/*",
	dialect: "postgresql",
	dbCredentials: {
		url: config.env.DATABASE_URL,
	},
});

export default drizzleConfig;
