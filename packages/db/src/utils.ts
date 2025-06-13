import { db } from "./index";
import { sql } from "drizzle-orm";

export async function isDbConnected(): Promise<boolean> {
	try {
		const result = await db.execute(sql`select 1`);
		return !!result || true;
	} catch {
		console.error("Failed to connect to database");
		return false;
	}
}

export async function getRoundTripLatency() {
	try {
		const beforeQuery = Date.now();
		await db.execute(sql`select 1`);
		const afterQuery = Date.now();
		const latency = afterQuery - beforeQuery;
		return latency;
	} catch {
		console.error("Failed to get round trip latency");
		return -1;
	}
}
