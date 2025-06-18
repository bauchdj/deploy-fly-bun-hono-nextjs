import type { KnipConfig } from "knip";

const localAndScripts = ["*.{ts,js}", "scripts/**/*.{ts,js}"];
const indexEntry = "src/index.{ts,js}";
const project = "**/*.{ts,js}";
const ignoreBinaries = ["fly"];

const config: KnipConfig = {
	workspaces: {
		".": {
			entry: localAndScripts,
			project: localAndScripts,
			ignoreDependencies: ["prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
		},

		"apps/server": {
			entry: indexEntry,
			project,
			ignoreBinaries,
		},

		// https://knip.dev/reference/plugins/next#_top
		"apps/web": {
			ignoreBinaries,
			ignoreDependencies: ["tailwindcss", "eslint", "eslint-config-next", "postcss"],
		},

		"packages/*": {
			entry: indexEntry,
			project,
			ignore: ["src/utils/*"],
		},
	},
};

export default config;
