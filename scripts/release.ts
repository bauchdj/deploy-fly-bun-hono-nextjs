#!/usr/bin/env bun
/**
 * release.ts
 *
 * Automates the release process by:
 * 1. Running tests
 * 2. Bumping version
 * 3. Creating a git tag
 * 4. Pushing to remote
 *
 * Usage:
 *   bun run scripts/release.ts [major|minor|patch] [--input <path> | -i <path>]
 *
 * Options:
 *   -i, --input  Path to package.json (default: ./package.json)
 */

import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

type VersionType = "major" | "minor" | "patch";

/**
 * Runs a command and returns its output
 * @param command - Command to run
 * @returns Command output
 */
function runCommand(command: string): string {
	try {
		return execSync(command, { encoding: "utf-8" }).trim();
	} catch (error) {
		console.error(`Error running command: ${command}`);
		console.error(error);
		process.exit(1);
	}
}

/**
 * Checks if the working directory is clean
 * @returns True if the working directory is clean
 */
function isWorkingDirectoryClean(): boolean {
	const status = runCommand("git status --porcelain");
	return status === "";
}

/**
 * Parse command line arguments
 * @returns Object containing version type and package.json path
 */
function parseArgs() {
	const args = process.argv.slice(2);
	const result: { versionType?: VersionType; packageJsonPath: string } = {
		packageJsonPath: resolve(process.cwd(), "package.json"),
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "-i" || arg === "--input") {
			result.packageJsonPath = resolve(process.cwd(), args[++i]!);
		} else if (["major", "minor", "patch"].includes(arg!)) {
			result.versionType = arg as VersionType;
		}
	}

	return result;
}

/**
 * Gets the current version from package.json
 * @param packageJsonPath - Path to package.json
 * @returns Current version
 * @throws If package.json doesn't exist or is invalid
 */
function getCurrentVersion(packageJsonPath: string): string {
	if (!existsSync(packageJsonPath)) {
		throw new Error(`package.json not found at: ${packageJsonPath}`);
	}

	try {
		const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
		if (!packageJson.version) {
			throw new Error("package.json is missing version field");
		}
		return packageJson.version;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to parse package.json: ${error.message}`);
		}
		throw new Error("Failed to parse package.json: Unknown error");
	}
}

/**
 * Runs tests to ensure everything is working
 */
function runTests(): void {
	console.log("Running tests...");
	runCommand("bun run lint");
	runCommand("bun test --coverage");
	console.log("✅ Tests passed");
}

/**
 * Bumps the version
 * @param versionType - Type of version bump
 * @returns New version
 */
function bumpVersion(
	versionType: VersionType,
	packageJsonPath: string
): string {
	console.log(`Bumping ${versionType} version...`);
	runCommand(`bun run scripts/bump-version.ts ${versionType}`);
	const newVersion = getCurrentVersion(packageJsonPath);
	console.log(`✅ Version bumped to ${newVersion}`);
	return newVersion;
}

/**
 * Creates a git tag for the release
 * @param version - Version to tag
 */
function createGitTag(version: string): void {
	console.log("Creating git commit and tag...");
	runCommand(`git add package.json`);
	runCommand(`git commit -m "chore: bump version to ${version}"`);
	runCommand(`git tag -a v${version} -m "Release v${version}"`);
	console.log(`✅ Created git tag v${version}`);
}

/**
 * Pushes changes and tags to remote
 */
function pushToRemote(): void {
	console.log("Pushing to remote...");
	runCommand("git push");
	runCommand("git push --tags");
	console.log("✅ Pushed to remote");
}

/**
 * Main release function
 * @param versionType - Type of version bump
 * @param packageJsonPath - Path to package.json
 */
async function release(versionType: VersionType, packageJsonPath: string) {
	try {
		// Verify package.json exists and is readable
		getCurrentVersion(packageJsonPath);
		console.log("Starting release process...");

		// Check if working directory is clean
		if (!isWorkingDirectoryClean()) {
			console.error(
				"Working directory is not clean. Please commit or stash your changes."
			);
			process.exit(1);
		}

		// Run tests
		runTests();

		// Bump version
		const newVersion = bumpVersion(versionType, packageJsonPath);

		// Create git tag
		createGitTag(newVersion);

		// Push to remote
		pushToRemote();

		console.log(`\n🎉 Successfully released v${newVersion}`);
		console.log("The CI/CD pipeline will now handle the deployment.");
	} catch (error) {
		console.error("Release failed:", error);
		process.exit(1);
	}
}

// Parse command line arguments
const { versionType, packageJsonPath } = parseArgs();

if (!versionType) {
	console.error('Please specify version type: "major", "minor", or "patch"');
	console.error("\nUsage:");
	console.error(
		"  bun run scripts/release.ts [major|minor|patch] [--input <path> | -i <path>]"
	);
	console.error("\nOptions:");
	console.error(
		"  -i, --input  Path to package.json (default: ./package.json)"
	);
	process.exit(1);
}

console.log(`Using package.json at: ${packageJsonPath}`);

release(versionType, packageJsonPath);
