import { databaseEnvVars } from "./database";
import { serverEnvVars } from "./server";
import { webEnvVars } from "./web";

// Define required environment variables
const envVars = [...databaseEnvVars, ...serverEnvVars, ...webEnvVars] as const;

// Ensure all environment variables are unique
const uniqueEnvVars = new Set(envVars);
if (uniqueEnvVars.size !== envVars.length) {
	console.error(
		"Duplicate environment variables found. Check const arrays of env variables."
	);
	process.exit(1);
}

if (Bun.env.NODE_ENV === "development") {
	const { validateEnvFile } = await import("./utils/validate-env-file");
	await validateEnvFile(envVars);
	console.log("Environment variables validated successfully");
}

type EnvKey = (typeof envVars)[number];
type EnvVars = {
	[K in EnvKey]: string;
};

// Validate that all required environment variables are set
const env: EnvVars = {} as EnvVars;

for (const key of envVars) {
	if (Bun === undefined) {
		console.error(
			`Bun is undefined. Environment variables are not loaded. Try bun --bun run <cmd>`
		);
		process.exit(1);
	}

	const value = Bun.env[key];
	if (value === undefined || value === "") {
		console.error(`Missing required environment variable: ${key}`);
		process.exit(1);
	}
	// At this point, TypeScript knows value is a string
	env[key] = value as string;
}

const config = { env } as const;

export { config };
