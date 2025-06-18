import { glob } from "glob";

export const ROOT_ENV_GLOB_PATTERN = ".env{,.development,.test,.production,.staging}{,.local}";
export const CHILDREN_ENV_GLOB_PATTERN = `*/**/${ROOT_ENV_GLOB_PATTERN}`;

export function getEnvFiles(globPattern: string, rootDir: string): Promise<string[]> {
	return glob(globPattern, {
		cwd: rootDir,
		nodir: true,
		absolute: true,
		dot: true,
		ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/coverage/**", "**/out/**"],
	});
}
