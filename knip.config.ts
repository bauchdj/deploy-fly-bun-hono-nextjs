import type { KnipConfig } from "knip";

const project = "**/*.{ts,js}";
const ignoreBinaries = ["fly"];

const config: KnipConfig = {
	workspaces: {
		".": {
			entry: "scripts/*.{ts,js}",
			project: "scripts/**/*.{ts,js}",
		},
		"apps/server": {
			entry: "src/index.{ts,js}",
			project,
			ignoreBinaries,
		},
		// https://knip.dev/reference/plugins/next#_top
		"apps/web": {
			ignoreBinaries,
			ignoreDependencies: ["tailwindcss", "postcss"],
		},
		"packages/*": {
			entry: "src/index.{ts,js}",
			project,
			ignore: ["src/utils/*"],
		},
	},
};

export default config;
