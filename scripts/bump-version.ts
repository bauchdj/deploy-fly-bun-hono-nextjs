#!/usr/bin/env bun

/**
 * bump-version.ts
 *
 * Automates version bumping according to semantic versioning.
 *
 * Usage:
 *   bun run scripts/bump-version.ts [major|minor|patch] [--input <path> | -i <path>] [--dry-run | -n]
 *
 * Options:
 *   -i, --input  Path to package.json (default: ./package.json)
 *   -n, --dry-run  Show what would be changed without writing to disk
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

type VersionType = "major" | "minor" | "patch";

interface PackageJson {
	version: string;
	[key: string]: unknown;
}

/**
 * Parse command line arguments
 * @returns Object containing version type and package.json path
 */
function parseArgs() {
	const args = process.argv.slice(2);
	const result: { versionType?: VersionType; packageJsonPath: string; dryRun: boolean } = {
		packageJsonPath: resolve(process.cwd(), "package.json"),
		dryRun: false,
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "-i" || arg === "--input") {
			result.packageJsonPath = resolve(process.cwd(), args[++i]!);
		} else if (arg === "-n" || arg === "--dry-run") {
			result.dryRun = true;
		} else if (["major", "minor", "patch"].includes(arg!)) {
			result.versionType = arg as VersionType;
		}
	}

	return result;
}

/**
 * Bumps the version in package.json
 * @param versionType - The type of version bump (major, minor, patch)
 * @param packageJsonPath - Path to package.json
 * @param dryRun - If true, only show what would be changed without writing to disk
 */
function bumpVersion(versionType: VersionType, packageJsonPath: string, dryRun = false): void {
	try {
		// Verify package.json exists
		if (!existsSync(packageJsonPath)) {
			throw new Error(`package.json not found at: ${packageJsonPath}`);
		}

		// Read the package.json file
		const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
		const packageJson = JSON.parse(packageJsonContent) as PackageJson;

		if (!packageJson.version) {
			throw new Error("package.json is missing version field");
		}

		// Parse the current version
		const [major, minor, patch] = packageJson.version.split(".").map(Number);

		if (major === undefined || minor === undefined || patch === undefined) {
			throw new Error(`Invalid version format in package.json. ${major}.${minor}.${patch}`);
		}

		// Calculate the new version
		let newVersion: string;
		switch (versionType) {
			case "major":
				newVersion = `${major + 1}.0.0`;
				break;
			case "minor":
				newVersion = `${major}.${minor + 1}.0`;
				break;
			case "patch":
				newVersion = `${major}.${minor}.${patch + 1}`;
				break;
			default:
				throw new Error(`Invalid version type: ${versionType}`);
		}

		// Update the version in package.json
		packageJson.version = newVersion;

		if (dryRun) {
			console.log(`[DRY RUN] Would update ${packageJsonPath} version from ${major}.${minor}.${patch} to ${newVersion}`);
		} else {
			// Write the updated package.json
			writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, "\t") + "\n");
			console.log(`Version bumped from ${major}.${minor}.${patch} to ${newVersion}`);
		}
	} catch (error) {
		console.error(`Error bumping version: ${error}`);
		process.exit(1);
	}
}

// Parse command line arguments
const { versionType, packageJsonPath, dryRun } = parseArgs();

if (!versionType) {
	console.error('Please specify version type: "major", "minor", or "patch"');
	console.error("\nUsage:");
	console.error("  bun run scripts/bump-version.ts [major|minor|patch] [--input <path> | -i <path>]");
	console.error("\nOptions:");
	console.error("  -i, --input  Path to package.json (default: ./package.json)");
	process.exit(1);
}

if (dryRun) {
	console.log("[DRY RUN] Running in dry-run mode. No files will be modified.");
}
console.log(`Using package.json at: ${packageJsonPath}`);
bumpVersion(versionType, packageJsonPath, dryRun);
