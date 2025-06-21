import { databaseEnvVars } from "./database";
import { serverEnvVars } from "./server";
import { cacheEnvVars } from "./cache";
import { webEnvVars } from "./web";

// Check if Bun is defined. Used to load environment variables
if (Bun === undefined) {
	console.error(`Bun is undefined. Environment variables are not loaded. Try bun --bun run <cmd>`);
	process.exit(1);
}

// Define required environment variables
const envVars = [...serverEnvVars, ...webEnvVars, ...databaseEnvVars, ...cacheEnvVars] as const;

// Ensure all environment variables are unique
const uniqueEnvVars = new Set(envVars);
if (uniqueEnvVars.size !== envVars.length) {
	console.error("Duplicate environment variables found. Check const arrays of env variables.");
	process.exit(1);
}

// Breaks drizzle cli right now
// if (Bun.env.NODE_ENV === "development") {
// 	const { validateEnvFile } = await import("./utils/validate-env-file");
// 	await validateEnvFile(envVars);
// 	console.log("Environment variables validated successfully");
// }

type EnvKey = (typeof envVars)[number];
type EnvVars = Record<EnvKey, string>;

// Validate that all required environment variables are set
const env: EnvVars = {} as EnvVars;
const missingEnv: Set<EnvKey> = new Set();

for (const key of envVars) {
	const value = Bun.env[key];
	if (value === undefined || value === "") {
		missingEnv.add(key);
	}
	// At this point, TypeScript knows value is a string
	env[key] = value as string;
}

if (missingEnv.size > 0) {
	console.error(`Missing required environment variables: ${Array.from(missingEnv).join(", ")}`);
	process.exit(1);
}

const config = { env } as const;

export { config };
