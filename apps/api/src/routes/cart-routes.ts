// apps/api/src/routes/cart-routes.ts
import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { CartRepository } from '../repositories/cart.repository.js';

const CART_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 ngày

interface CartItemInput {
  product_id: string;
  quantity: number;
}

interface SyncCartRequestBody {
  guest_session_id?: string;
  items?: CartItemInput[];
}

interface GetCartQuery {
  guest_session_id?: string;
}

function normalizeQuantity(value: number | string | undefined): number {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
}

/**
 * Merge items vào một cart key trong Redis.
 * Cộng dồn quantity nếu product_id đã tồn tại.
 * Dùng DEL + HSET + EXPIRE trong một chuỗi để nhất quán.
 */
async function mergeCartToRedis(
  redis: FastifyInstance['redis'],
  key: string,
  newItems: CartItemInput[],
  isUserCart: boolean,
): Promise<void> {
  // Đọc giỏ hàng hiện tại
  const existing = await redis.hgetall(key);
  const nextEntries = new Map<string, number>();

  // Load existing items
  for (const [productId, quantity] of Object.entries(existing)) {
    const qty = normalizeQuantity(quantity as string);
    if (qty > 0) nextEntries.set(productId, qty);
  }

  // Merge new items (cộng dồn)
  for (const item of newItems) {
    const qty = normalizeQuantity(item.quantity);
    if (!item.product_id || qty <= 0) continue;
    const current = nextEntries.get(item.product_id) ?? 0;
    nextEntries.set(item.product_id, current + qty);
  }

  // Ghi lại
  await redis.del(key);

  if (nextEntries.size > 0) {
    const normalized: Record<string, string> = {};
    for (const [productId, quantity] of nextEntries.entries()) {
      normalized[productId] = String(quantity);
    }
    await redis.hset(key, normalized);

    // Đặt TTL: 30 ngày cho user cart, 7 ngày cho guest cart
    const ttl = isUserCart ? CART_TTL_SECONDS : 7 * 24 * 60 * 60;
    await redis.expire(key, ttl);
  }
}

export async function cartRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  /**
   * POST /api/cart/sync
   * - Không yêu cầu auth — dùng optionalAuthenticate
   * - Nếu user đã đăng nhập: merge guest cart vào user cart trong một lần, xóa guest cart
   * - Nếu chưa đăng nhập: merge incoming items vào guest cart
   */
  fastify.post<{ Body: SyncCartRequestBody }>(
    '/api/cart/sync',
    { onRequest: [fastify.optionalAuthenticate] },
    async (request, reply) => {
      try {
        const userId = request.user?.sub ?? null;
        const guestSessionId =
          request.body?.guest_session_id ||
          (request.headers['x-guest-session-id'] as string | undefined);
        const incomingItems = request.body?.items ?? [];

        if (!userId && !guestSessionId) {
          return reply
            .code(400)
            .send({ success: false, message: 'Thiếu thông tin phiên: cần userId hoặc guest_session_id.' });
        }

        const targetKey = userId ? `cart:user:${userId}` : `cart:guest:${guestSessionId}`;

        if (userId && guestSessionId) {
          // Đã đăng nhập: đọc guest cart + incoming items, merge một lần vào user cart
          const sourceKey = `cart:guest:${guestSessionId}`;
          const guestCart = await fastify.redis.hgetall(sourceKey);
          const guestItems: CartItemInput[] = Object.entries(guestCart)
            .filter(([, q]) => normalizeQuantity(q as string) > 0)
            .map(([productId, q]) => ({
              product_id: productId,
              quantity: normalizeQuantity(q as string),
            }));

          // Merge tất cả trong một lần: guestItems + incomingItems
          await mergeCartToRedis(fastify.redis, targetKey, [...guestItems, ...incomingItems], true);
          await fastify.redis.del(sourceKey);
        } else {
          // Chưa đăng nhập hoặc chỉ có userId: merge incoming items
          if (incomingItems.length > 0) {
            await mergeCartToRedis(fastify.redis, targetKey, incomingItems, !!userId);
          }
        }

        return reply.code(200).send({ success: true, message: 'Đã hợp nhất giỏ hàng thành công.' });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi hệ thống khi đồng bộ giỏ hàng');
        return reply.code(500).send({ success: false, message: 'Lỗi hệ thống khi đồng bộ giỏ hàng.' });
      }
    },
  );

  /**
   * GET /api/cart
   * Lấy giỏ hàng hiện tại (user hoặc guest).
   * Không yêu cầu auth — dùng optionalAuthenticate.
   */
  fastify.get<{ Querystring: GetCartQuery }>(
    '/api/cart',
    { onRequest: [fastify.optionalAuthenticate] },
    async (request, reply) => {
      try {
        const userId = request.user?.sub ?? null;
        let cartData: Record<string, string> = {};

        if (userId) {
          cartData = await fastify.redis.hgetall(`cart:user:${userId}`);
        } else {
          const guestSessionId =
            (request.headers['x-guest-session-id'] as string) ||
            request.query.guest_session_id;
          if (!guestSessionId) {
            return reply.code(400).send({ success: false, message: 'Thiếu thông tin phiên guest.' });
          }
          cartData = await fastify.redis.hgetall(`cart:guest:${guestSessionId}`);
        }

        const productIds = Object.keys(cartData).filter(
          (id) => normalizeQuantity(cartData[id]) > 0,
        );

        if (productIds.length === 0) {
          return reply.code(200).send({ success: true, data: [] });
        }

        const products = await CartRepository.getProductDetails(productIds);

        const detailedCartItems = products.map((row: Record<string, unknown>) => ({
          product: row,
          quantity: normalizeQuantity(cartData[row.id as string]),
        }));

        return reply.code(200).send({ success: true, data: detailedCartItems });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi hệ thống khi lấy giỏ hàng');
        return reply.code(500).send({ success: false, message: 'Lỗi hệ thống khi lấy giỏ hàng.' });
      }
    },
  );
}