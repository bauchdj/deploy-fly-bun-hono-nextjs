import { Hono } from "hono";

const app = new Hono();

const healthHandler = app.get("/health", c => c.text(`Health check ${new Date().toISOString()}`));

export type HealthHandler = typeof healthHandler;

export default app;
