import { Elysia } from "elysia";
import { authRoutes } from "./auth/auth.routes";
import { config } from './config';
const app = new Elysia()
.use(authRoutes)
.listen(config.backend.port ?? 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
