import { config } from "@demo/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
	connectionString: config.env.DATABASE_URL,
});
export const db = drizzle({ client: pool });
