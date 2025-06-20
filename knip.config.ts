import type { KnipConfig } from "knip";

const localAndScripts = ["*.{ts,js}", "scripts/**/*.{ts,js}"];
const indexEntry = "src/index.{ts,js}";
const project = "**/*.{ts,js}";
const ignoreHealthCheck = ["health-check.{ts,js}"];
const ignoreUtils = ["src/utils/*"];
const ignoreBinaries = ["fly"];
const ignoreTsconfigDependencies = ["@deploy-fly-bun-hono-nextjs/tsconfig"];

const config: KnipConfig = {
	workspaces: {
		".": {
			entry: localAndScripts,
			project: localAndScripts,
			ignoreDependencies: ignoreTsconfigDependencies,
		},

		"apps/server": {
			entry: indexEntry,
			project,
			ignore: ignoreHealthCheck,
			ignoreBinaries,
		},

		// https://knip.dev/reference/plugins/next#_top
		"apps/web": {
			ignore: ignoreHealthCheck,
			ignoreBinaries,
			ignoreDependencies: ["tailwindcss", "eslint", "eslint-config-next", "postcss"],
		},

		"packages/cache": {
			ignore: ignoreUtils,
			ignoreBinaries,
		},

		"packages/config": {
			ignore: ignoreUtils,
		},

		"packages/tsconfig": {
			entry: "base.json",
		},
	},
};

export default config;
