#!/usr/bin/env bun
/**
 * release.ts
 *
 * Automates the release process by:
 * 1. Running tests
 * 2. Bumping version
 * 3. Creating a git tag
 * 4. Pushing to remote
 */

import { execSync } from "child_process";
import { readFileSync } from "fs";
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
 * Gets the current version from package.json
 * @returns Current version
 */
function getCurrentVersion(): string {
	const packageJsonPath = resolve(process.cwd(), "package.json");
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
	return packageJson.version;
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
function bumpVersion(versionType: VersionType): string {
	console.log(`Bumping ${versionType} version...`);
	runCommand(`bun run scripts/bump-version.ts ${versionType}`);
	const newVersion = getCurrentVersion();
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
 */
function release(versionType: VersionType): void {
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
	const newVersion = bumpVersion(versionType);

	// Create git tag
	createGitTag(newVersion);

	// Push to remote
	pushToRemote();

	console.log(`\n🎉 Successfully released v${newVersion}`);
	console.log("The CI/CD pipeline will now handle the deployment.");
}

// Get the version type from command line arguments
const versionType = process.argv[2] as VersionType;
if (!versionType || !["major", "minor", "patch"].includes(versionType)) {
	console.error(
		"Please specify a valid version type: major, minor, or patch"
	);
	process.exit(1);
}

release(versionType);
