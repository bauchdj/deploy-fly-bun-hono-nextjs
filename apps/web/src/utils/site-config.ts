import { config } from "@deploy-fly-bun-hono-nextjs/config";

export const siteConfig = {
	name: "Nimbus",
	description: "A better cloud storage solution.",
	url: config.env.NEXT_PUBLIC_WEB_URL,
	twitterHandle: "@nimbusdotcloud",
} as const;
