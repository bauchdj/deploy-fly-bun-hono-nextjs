import { getEnvCount } from "./env-count";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export async function validateEnvFile(envVars: readonly string[]) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const envPath = join(__dirname, "../.env");
	const envCountFromEnvFile = await getEnvCount(envPath);
	if (envCountFromEnvFile !== envVars.length) {
		console.error(
			`Environment variables count does not match. Expected ${envVars.length}, got ${envCountFromEnvFile}.`
		);
		process.exit(1);
	}
}
