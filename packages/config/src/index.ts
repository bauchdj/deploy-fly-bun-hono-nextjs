// Define required environment variables
const envVars = [
	"DATABASE_URL",
	"POSTGRES_USER",
	"POSTGRES_PASSWORD",
	"POSTGRES_DB",
	"NEXT_PUBLIC_SERVER_URL",
	"SERVER_PORT",
	"NEXT_PUBLIC_ENDPOINT",
	"WEB_URL",
	"WEB_PORT",
] as const;

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
