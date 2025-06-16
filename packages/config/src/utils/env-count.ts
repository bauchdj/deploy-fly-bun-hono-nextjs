import { readFile } from "node:fs/promises";

export async function getEnvCount(envPath: string): Promise<number> {
	try {
		const content = await readFile(envPath, "utf-8");

		const lines = content.split("\n");

		const envCount = lines.reduce((acc, line) => {
			// Trim whitespace
			const trimmed = line.trim();
			// Ignore empty lines and comments (#)
			if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
				return acc + 1;
			}
			return acc;
		}, 0);

		return envCount;
	} catch (error) {
		console.error(`Error reading environment file: ${error}`);
		process.exit(1);
	}
}
