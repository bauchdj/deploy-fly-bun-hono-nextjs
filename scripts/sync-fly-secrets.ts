import { readFile } from "fs/promises";
import path from "path";

const NODE_ENV = process.env.NODE_ENV;
const ENV_FILE = `.env.${NODE_ENV}.local`;
console.log({ ENV_FILE });

if (!NODE_ENV) {
	console.error("NODE_ENV is not set");
	process.exit(1);
}

async function fileExists(filePath: string): Promise<boolean> {
	try {
		await Bun.file(filePath).exists();
		return true;
	} catch {
		return false;
	}
}

function parseEnvFile(envContent: string): Record<string, string> {
	return envContent
		.split("\n")
		.filter(
			(line) => line.trim() && !line.startsWith("#") && line.includes("=")
		)
		.reduce((acc, line) => {
			const idx = line.indexOf("=");
			if (idx > 0) {
				const key = line.slice(0, idx).trim();
				const value = line.slice(idx + 1).trim();
				acc[key] = value;
			}
			return acc;
		}, {} as Record<string, string>);
}

async function getFlySecrets(): Promise<string[]> {
	const proc = Bun.spawn(["fly", "secrets", "list"], {
		stdout: "pipe",
		stderr: "inherit",
	});
	
	const text = await new Response(proc.stdout).text();
	if (!text) {
		throw new Error("Failed to get Fly secrets: empty response");
	}

	const lines = text.split("\n");
	if (lines.length < 2) {
		throw new Error("Failed to get Fly secrets: unexpected format");
	}

	const secretKeys = lines
		.slice(1)
		.map((line) => {
			const parts = line.split(/\s+/);
			if (!parts[0]) {
				throw new Error(`Failed to parse secret key from line: ${line}`);
			}
			return parts[0];
		});

	return secretKeys;
}

async function setFlySecrets(env: Record<string, string>) {
	const pairs = Object.entries(env)
		.map(([k, v]) => `${k}=${v}`)
		.join("\n");
	if (!pairs) return;

	const proc = Bun.spawn(["fly", "secrets", "import"], {
		stdin: "pipe",
		stdout: "inherit",
		stderr: "inherit",
	});
	// Write pairs to stdin
	proc.stdin.write(pairs);
	proc.stdin.end();
	await proc.exited;
}

async function unsetFlySecrets(keys: string[]) {
	if (keys.length === 0) return;
	const proc = Bun.spawn(["fly", "secrets", "unset", ...keys], {
		stdout: "inherit",
		stderr: "inherit",
	});
	await proc.exited;
}

async function main() {
	const envPath = path.resolve(process.cwd(), ENV_FILE);
	if (!(await fileExists(envPath))) {
		console.error(
			`[ERROR] ${ENV_FILE} not found in project root. Aborting.`
		);
		process.exit(1);
	}

	const envContent = await readFile(envPath, "utf8");
	const envVars = parseEnvFile(envContent);

	// 1. Set/update all secrets from .env
	await setFlySecrets(envVars);

	// 2. Get all current secrets from Fly
	const flySecrets = await getFlySecrets();
	const envKeys = Object.keys(envVars);

	// 3. Find secrets to delete
	const toDelete = flySecrets.filter((key) => !envKeys.includes(key));

	// 4. Delete secrets no longer in .env
	await unsetFlySecrets(toDelete);

	console.info(`[INFO] Fly secrets synced with ${ENV_FILE}.`);
}

main().catch((err) => {
	console.error("[ERROR] Failed to sync Fly secrets:", err);
	process.exit(1);
});
