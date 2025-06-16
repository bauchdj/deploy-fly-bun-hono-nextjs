import { config } from "@deploy-fly-bun-hono-nextjs/config";
import { Hono } from "hono";
import { service } from "../services";

const app = new Hono();

const expectedEndpoint = "hello";
const endpoint = config.env.NEXT_PUBLIC_ENDPOINT;
if (endpoint != expectedEndpoint) {
	throw new Error(`NEXT_PUBLIC_ENDPOINT must be '${expectedEndpoint}'`);
}

const helloHandler = app.get(`/${endpoint}`, async (c) => {
	const message = await service();
	return c.text(message);
});

export type HelloHandler = typeof helloHandler;

export default app;
