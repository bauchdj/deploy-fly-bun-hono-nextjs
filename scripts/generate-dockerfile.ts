#!/usr/bin/env bun
/**
 * generate-dockerfile.ts
 *
 * Generates a Dockerfile with mounted secrets based on the environment variables
 * defined in the .env file.
 */

import { parse } from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { transformEnvVarsToCommandString } from "./helper";

/**
 * Reads and parses the .env file
 * @param envPath - Path to the .env file
 * @returns Object containing the environment variables
 */
const readEnvFile = (envPath: string): Record<string, string> => {
	try {
		const envContent = readFileSync(envPath, "utf-8");
		return parse(envContent);
	} catch (error) {
		console.error(`Error reading .env file: ${error}`);
		return {};
	}
};

const JOIN_COMMAND = "\n";

/**
 * Generates a Dockerfile with mounted secrets
 * @param envVars - Environment variables to include as secrets
 * @returns The Dockerfile content
 */
const generateDockerfile = (envVars: Record<string, string>): string => {
	const secretMounts = transformEnvVarsToCommandString(
		envVars,
		(key) => `    --mount=type=secret,id=${key} \\`,
		JOIN_COMMAND
	);

	const secretExports = transformEnvVarsToCommandString(
		envVars,
		(key) => `    ${key}="$(cat /run/secrets/${key})" \\`,
		JOIN_COMMAND
	);

	return `FROM oven/bun:slim AS builder

RUN mkdir /app
# Bun app lives here
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# copy source across (excludes items filtered by .dockerignore)
COPY . .

RUN mkdir -p data
RUN \\
${secretMounts}
${secretExports}
    bun run build

FROM oven/bun:slim AS runner
RUN apt update -qq && apt install tree

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app

WORKDIR /app

# Start the server by default, this can be overwritten at runtime
CMD [ "bun", "dist/index.js" ]
`;
};

/**
 * Main function to generate the Dockerfile
 */
const main = (): void => {
	const rootDir = resolve(__dirname, "..");
	const envPath = resolve(rootDir, ".env");
	const dockerfilePath = resolve(rootDir, "Dockerfile");

	console.log("Reading .env file...");
	const envVars = readEnvFile(envPath);

	if (Object.keys(envVars).length === 0) {
		console.error("No environment variables found in .env file");
		process.exit(1);
	}

	console.log(`Found ${Object.keys(envVars).length} environment variables`);
	const dockerfileContent = generateDockerfile(envVars);

	console.log("Writing Dockerfile...");
	writeFileSync(dockerfilePath, dockerfileContent);
	console.log(`Dockerfile generated at ${dockerfilePath}`);
};

// Run the main function
main();
