import { FlatCompat } from "@eslint/eslintrc";
import oxlint from "eslint-plugin-oxlint";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	{
		ignores: [
			"**/node_modules",
			"**/.next",
			"**/dist",
			"**/build",
			"**/coverage",
			"**/out",
			"**/eslint.config.js",
		],
	},

	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		settings: {
			next: {
				rootDir: ["apps/web"],
			},
		},
	},

	// https://github.com/oxc-project/eslint-plugin-oxlint
	...oxlint.configs["flat/recommended"],
];

export default eslintConfig;
