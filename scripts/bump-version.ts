#!/usr/bin/env bun
/**
 * bump-version.ts
 *
 * Automates version bumping according to semantic versioning.
 * Usage: bun run scripts/bump-version.ts [major|minor|patch]
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

type VersionType = "major" | "minor" | "patch";

interface PackageJson {
	version: string;
	[key: string]: unknown;
}

/**
 * Bumps the version in package.json
 * @param versionType - The type of version bump (major, minor, patch)
 */
function bumpVersion(versionType: VersionType): void {
	const packageJsonPath = resolve(process.cwd(), "package.json");

	try {
		// Read the package.json file
		const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
		const packageJson = JSON.parse(packageJsonContent) as PackageJson;

		// Parse the current version
		const [major, minor, patch] = packageJson.version
			.split(".")
			.map(Number);

		if (!major || !minor || !patch) {
			throw new Error("Invalid version format in package.json");
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

		// Write the updated package.json
		writeFileSync(
			packageJsonPath,
			JSON.stringify(packageJson, null, "\t") + "\n"
		);

		console.log(
			`Version bumped from ${major}.${minor}.${patch} to ${newVersion}`
		);
	} catch (error) {
		console.error(`Error bumping version: ${error}`);
		process.exit(1);
	}
}

// Get the version type from command line arguments
const versionType = process.argv[2] as VersionType;
if (!versionType || !["major", "minor", "patch"].includes(versionType)) {
	console.error(
		"Please specify a valid version type: major, minor, or patch"
	);
	process.exit(1);
}

bumpVersion(versionType);
