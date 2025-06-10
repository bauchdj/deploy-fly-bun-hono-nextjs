#!/usr/bin/env bun
/**
 * generate-deploy-commands.ts
 *
 * Generates deploy commands with build secrets for both fly and docker
 * based on the environment variables defined in the .env file.
 *
 * Usage:
 * bun run scripts/generate-deploy-commands.ts [options]
 *
 * Options:
 * -f, --fly         Generate only Fly deployment command
 * -d, --docker      Generate only Docker build command
 * --docker-build    Execute the Docker build command directly
 */

import { parse } from "dotenv";
import { readFileSync } from "fs";
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

/**
 * Generates a fly deploy command with build secrets
 * @param envVars - Environment variables to include as build secrets
 * @returns The fly deploy command
 */
function generateFlyDeployCommand(envVars: Record<string, string>): string {
	const buildSecrets = transformEnvVarsToCommandString(
		envVars,
		(key, value) => `--build-secret ${key}=${value}`
	);

	return `fly deploy ${buildSecrets}`;
}

/**
 * Generates a docker build command with secrets
 * @param envVars - Environment variables to include as secrets
 * @returns The docker build command
 */
function generateDockerBuildCommand(envVars: Record<string, string>): string {
	const secrets = transformEnvVarsToCommandString(
		envVars,
		(key) => `--secret id=${key},env=${key}`
	);

	return `docker build ${secrets} -t borea-ts-api .`;
}

/**
 * Parse command line arguments
 * @returns Object containing parsed command line options
 */
function parseArgs(): { fly: boolean; docker: boolean; dockerBuild: boolean } {
	const args = process.argv.slice(2);
	return {
		fly: args.includes("-f") || args.includes("--fly"),
		docker: args.includes("-d") || args.includes("--docker"),
		dockerBuild: args.includes("-b") || args.includes("--docker-build"),
	};
}

/**
 * Executes a command in the shell
 * @param command - The command to execute
 */
async function executeCommand(command: string): Promise<void> {
	try {
		console.log(`Executing: ${command}`);
		const proc = Bun.spawn(["/bin/sh", "-c", command], {
			stdio: ["inherit", "inherit", "inherit"],
		});
		await proc.exited;
		const exitCode = proc.exitCode;
		if (exitCode !== 0) {
			console.error(`Command failed with exit code ${exitCode}`);
		}
	} catch (error) {
		console.error(`Error executing command: ${error}`);
	}
}

/**
 * Main function to generate deploy commands
 */
async function main(): Promise<void> {
	const options = parseArgs();
	const rootDir = resolve(__dirname, "..");
	const envPath = resolve(rootDir, ".env");

	console.log("Reading .env file...");
	const envVars = readEnvFile(envPath);

	if (Object.keys(envVars).length === 0) {
		console.error("No environment variables found in .env file");
		process.exit(1);
	}

	console.log(`Found ${Object.keys(envVars).length} environment variables`);

	// If no specific flags are provided, show all commands
	const showAll = !options.fly && !options.docker && !options.dockerBuild;

	if (showAll || options.fly) {
		const flyCommand = generateFlyDeployCommand(envVars);
		console.log("\n=== Fly Deploy Command ===");
		console.log(flyCommand);
	}

	if (showAll || options.docker || options.dockerBuild) {
		const dockerCommand = generateDockerBuildCommand(envVars);
		console.log("\n=== Docker Build Command ===");
		console.log(dockerCommand);

		if (options.dockerBuild) {
			await executeCommand(dockerCommand);
		}
	}

	if (showAll) {
		console.log(
			"\nYou can run these commands directly or save them to a file."
		);
	}
}

// Run the main function
main().catch((error) => {
	console.error(`Error in main function: ${error}`);
	process.exit(1);
});
