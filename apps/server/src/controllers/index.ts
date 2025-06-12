import { service } from "@/services";
import { config } from "@demo/config";
import { Hono } from "hono";

const app = new Hono();

app.get(`/${config.env.NEXT_PUBLIC_ENDPOINT}`, async (c) => {
	const message = await service();
	return c.text(message);
});

export default app;
