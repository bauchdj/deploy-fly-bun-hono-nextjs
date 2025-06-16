import { config } from "@deploy-fly-bun-hono-nextjs/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "./schema";

const pool = new Pool({
	connectionString: config.env.DATABASE_URL,
});
export const db = drizzle({ client: pool, schema });
