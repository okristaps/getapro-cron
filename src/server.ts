import { OpenAPIHono } from "@hono/zod-openapi";
import { Env } from "hono";
const app = new OpenAPIHono<Env>();

export default app;
