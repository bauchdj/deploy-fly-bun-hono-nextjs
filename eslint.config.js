import next from "@next/eslint-plugin-next";
import oxlint from "eslint-plugin-oxlint";

const eslintConfig = [
	{
		ignores: [
			"**/node_modules",
			"**/.next",
			"**/dist",
			"**/build",
			"**/coverage",
			"**/out",
		],
	},

	{
		files: ["./apps/web/**/*"],
		plugins: {
			next,
		},
	},

	// https://github.com/oxc-project/eslint-plugin-oxlint
	...oxlint.configs["flat/recommended"],
];

export default eslintConfig;
