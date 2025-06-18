import { config } from "@deploy-fly-bun-hono-nextjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { schema } from "./schema";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: config.env.DATABASE_URL,
});
export const db = drizzle({ client: pool, schema });
