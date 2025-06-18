import { buildEslintConfig } from "@deploy-fly-bun-hono-nextjs/eslint";

const eslintConfig = [...buildEslintConfig(), { ignores: ["apps/web/**"] }];

export default eslintConfig;
