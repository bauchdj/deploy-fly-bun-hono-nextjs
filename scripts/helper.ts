/**
 * Transforms environment variables into a CLI command string
 * @param envVars - Environment variables to transform
 * @param transform - Function to transform each environment variable
 * @returns Command string with transformed environment variables
 */
export function transformEnvVarsToCommandString(
	envVars: Record<string, string>,
	transform: (key: string, value: string) => string,
	join = " "
): string {
	return Object.keys(envVars)
		.map((key) => {
			const value = envVars[key];
			if (!value) {
				throw new Error(`Missing environment variable: ${key}`);
			}
			return transform(key, value);
		})
		.join(join);
}
