import { FastifyInstance } from 'fastify';
import { OrderRepository } from '../repositories/order.repository.js';

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.post('/api/orders/checkout', { onRequest: [fastify.authenticate] }, async (request: any, reply) => {
    try {
      const { items, totalAmount } = request.body as any;
      const userId = request.user.sub;

      const orderId = await OrderRepository.checkout(userId, items, totalAmount);
      
      // Sau khi checkout thành công, xóa giỏ hàng trong Redis
      await fastify.redis.del(`cart:user:${userId}`);

      return reply.code(201).send({ success: true, orderId });
    } catch (err: any) {
      return reply.code(400).send({ success: false, message: err.message });
    }
  });
}