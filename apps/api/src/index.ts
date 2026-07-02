import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";

import redisPlugin from "./plugins/redis.js";
import authRoutes from "./routes/auth-routes.js";
import { cartRoutes } from "./routes/cart-routes.js";
import { marketRoutes } from "./routes/market-routes.js";
import { orderRoutes } from "./routes/order-routes.js";
import type { JwtUserPayload } from "./types/auth.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtUserPayload;
    user: JwtUserPayload;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

const fastify = Fastify({
  logger: true,
});

await fastify.register(fastifyJwt, {
  secret: jwtSecret,
});

// Định nghĩa decorator authenticate bảo vệ các tuyến đường yêu cầu đăng nhập
fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

await fastify.register(redisPlugin);
await fastify.register(authRoutes);
await fastify.register(cartRoutes);
await fastify.register(marketRoutes);
await fastify.register(orderRoutes);

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await fastify.listen({ port, host });
} catch (error) {
  fastify.log.error(error);
  process.exit(1);
}


