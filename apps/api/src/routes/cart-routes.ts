import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { CartRepository } from '../repositories/cart.repository.js';

interface CartItemInput { product_id: string; quantity: number; }
interface SyncCartRequestBody { guest_session_id?: string; items?: CartItemInput[]; }
interface GetCartQuery { guest_session_id?: string; }

function normalizeQuantity(value: number | string | undefined) {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export async function cartRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post('/api/cart/sync', async (request: FastifyRequest<{ Body: SyncCartRequestBody }>, reply: FastifyReply) => {
    try {
      const userId = request.user?.sub ?? null;
      const guestSessionId = request.body?.guest_session_id || (request.headers['x-guest-session-id'] as string | undefined);
      const incomingItems = request.body?.items ?? [];

      if (!userId && !guestSessionId) {
        return reply.code(400).send({ success: false, message: 'Thiếu thông tin xác thực.' });
      }

      const targetKey = userId ? `cart:user:${userId}` : `cart:guest:${guestSessionId}`;
      const sourceKey = guestSessionId ? `cart:guest:${guestSessionId}` : null;

      const mergeCart = async (key: string, items: CartItemInput[]) => {
        const existing = await fastify.redis.hgetall(key);
        const nextEntries = new Map<string, number>();

        for (const [productId, quantity] of Object.entries(existing)) {
          const qty = normalizeQuantity(quantity);
          if (qty > 0) {
            nextEntries.set(productId, qty);
          }
        }

        for (const item of items) {
          const qty = normalizeQuantity(item.quantity);
          if (!item.product_id || qty <= 0) continue;
          const current = nextEntries.get(item.product_id) ?? 0;
          nextEntries.set(item.product_id, current + qty);
        }

        const normalized: Record<string, string> = {};
        for (const [productId, quantity] of nextEntries.entries()) {
          if (quantity > 0) {
            normalized[productId] = String(quantity);
          }
        }

        if (Object.keys(normalized).length > 0) {
          await fastify.redis.del(key);
          await fastify.redis.hset(key, normalized);
        } else {
          await fastify.redis.del(key);
        }
      };

      if (userId && sourceKey) {
        const guestCart = await fastify.redis.hgetall(sourceKey);
        const guestItems = Object.entries(guestCart)
          .filter(([, quantity]) => normalizeQuantity(quantity) > 0)
          .map(([productId, quantity]) => ({ product_id: productId, quantity: normalizeQuantity(quantity) }));
        await mergeCart(targetKey, guestItems);
        await fastify.redis.del(sourceKey);
      }

      if (incomingItems.length > 0) {
        await mergeCart(targetKey, incomingItems);
      }

      return reply.code(200).send({ success: true, message: 'Đã hợp nhất giỏ hàng thành công.' });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, message: 'Lỗi hệ thống khi đồng bộ giỏ hàng.' });
    }
  });

  fastify.get('/api/cart', async (request: FastifyRequest<{ Querystring: GetCartQuery }>, reply: FastifyReply) => {
    try {
      const userId = request.user?.sub ?? null;
      let cartData: Record<string, string> = {};

      if (userId) {
        cartData = await fastify.redis.hgetall(`cart:user:${userId}`);
      } else {
        const guestSessionId = (request.headers['x-guest-session-id'] as string) || request.query.guest_session_id;
        if (!guestSessionId) return reply.code(400).send({ success: false, message: 'Thiếu thông tin xác thực.' });
        cartData = await fastify.redis.hgetall(`cart:guest:${guestSessionId}`);
      }

      const productIds = Object.keys(cartData);
      if (productIds.length === 0) return reply.send({ success: true, data: [] });

      const products = await CartRepository.getProductDetails(productIds);
      const detailedCartItems = products.map((row: any) => ({
        product: { ...row },
        quantity: normalizeQuantity(cartData[row.id]),
      }));

      return reply.code(200).send({ success: true, data: detailedCartItems });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, message: 'Lỗi hệ thống khi lấy giỏ hàng.' });
    }
  });
}