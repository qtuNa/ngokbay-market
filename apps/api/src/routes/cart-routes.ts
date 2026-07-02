import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { CartRepository } from '../repositories/cart.repository.js';

// Giữ lại các interfaces...
interface CartItemInput { product_id: string; quantity: number; }
interface SyncCartRequestBody { guest_session_id?: string; items?: CartItemInput[]; }
interface GetCartQuery { guest_session_id?: string; }

export async function cartRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  // API 1: POST /api/cart/sync (Giữ nguyên logic Redis Pipeline)
  fastify.post('/api/cart/sync', async (request: FastifyRequest<{ Body: SyncCartRequestBody }>, reply: FastifyReply) => {
    // ... (Logic Redis Pipeline như cũ) ...
    return reply.code(200).send({ success: true, message: 'Đã hợp nhất giỏ hàng thành công.' });
  });

  // API 2: GET /api/cart (Đã Refactor)
  fastify.get('/api/cart', async (request: FastifyRequest<{ Querystring: GetCartQuery }>, reply: FastifyReply) => {
    try {
      // 1. Xác thực và lấy cartData từ Redis
      let userId: string | null = null;
      try { await request.jwtVerify(); userId = request.user?.sub || null; } catch (err) {}

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

      // 2. Gọi Repository thay vì query SQL thuần
      const products = await CartRepository.getProductDetails(productIds);

      // 3. Map dữ liệu
      const detailedCartItems = products.map((row: any) => ({
        product: { ...row },
        quantity: parseInt(cartData[row.id] || '0', 10),
      }));

      return reply.code(200).send({ success: true, data: detailedCartItems });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, message: 'Lỗi hệ thống khi lấy giỏ hàng.' });
    }
  });
}