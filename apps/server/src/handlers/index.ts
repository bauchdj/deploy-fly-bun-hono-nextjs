import { service } from "../services";
import { config } from "@demo/config";
import { Hono } from "hono";

const app = new Hono();

const expectedEndpoint = "hello";
const endpoint = config.env.NEXT_PUBLIC_ENDPOINT;
if (endpoint != expectedEndpoint) {
	throw new Error(`NEXT_PUBLIC_ENDPOINT must be '${expectedEndpoint}'`);
}

const handler = app.get(`/${endpoint}`, async (c) => {
	const message = await service();
	return c.text(message);
});

export type HandlerType = typeof handler;

export default app;
