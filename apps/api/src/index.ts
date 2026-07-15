// apps/api/src/index.ts
// ⚠️  dotenv PHẢI được load TRƯỚC tất cả các import khác
import 'dotenv/config';

// --- Validate biến môi trường bắt buộc ---
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'] as const;
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[startup] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

import Fastify from 'fastify';
import authPlugin from './plugins/auth.js';
import redisPlugin from './plugins/redis.js';
import { authRoutes } from './routes/auth-routes.js';
import { cartRoutes } from './routes/cart-routes.js';
import { eventRoutes } from './routes/event-routes.js';
import { marketRoutes } from './routes/market-routes.js';
import { orderRoutes } from './routes/order-routes.js';
import { productRoutes } from './routes/product-routes.js';
import { settingsRoutes } from './routes/settings-routes.js';

const fastify = Fastify({ logger: true });

fastify.get('/health', async (_request, reply) => {
  reply.code(200).send({ success: true, message: 'ok' });
});

async function main() {
  await fastify.register(authPlugin);
  await fastify.register(redisPlugin);
  await fastify.register(authRoutes);
  await fastify.register(cartRoutes);
  await fastify.register(marketRoutes);
  await fastify.register(orderRoutes);
  await fastify.register(productRoutes);
  await fastify.register(eventRoutes);
  await fastify.register(settingsRoutes);

  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? '0.0.0.0';

  await fastify.listen({ port, host });
}

main().catch((error) => {
  fastify.log.error(error);
  process.exit(1);
});
