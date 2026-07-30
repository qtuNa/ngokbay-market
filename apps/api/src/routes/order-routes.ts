import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { checkoutSchema, CheckoutInput } from '@repo/validation';
import { OrderRepository } from '../repositories/order.repository.js';

export async function orderRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/api/orders/checkout',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Validation Layer
        const result = checkoutSchema.safeParse(request.body);
        if (!result.success) {
          return reply.code(400).send({
            success: false,
            message: 'Dữ liệu đơn hàng không hợp lệ',
            errors: result.error.format()
          });
        }

        const validatedData: CheckoutInput = result.data;
        
        // GIỜ ĐÂY: TypeScript tự hiểu request.user có trường .sub dạng string!
        // Thêm dấu hỏi chấm (?) phòng trường hợp route quên check auth (Type-safety tuyệt đối)
        const userId = request.user?.sub; 

        if (!userId) {
          return reply.code(401).send({ success: false, message: 'Không tìm thấy thông tin xác thực' });
        }

        // DB Transaction (giá và tổng tiền tự động tính từ DB)
        const orderId = await OrderRepository.checkout(userId, validatedData.items);
        
        // Clear Redis Cart
        await fastify.redis.del(`cart:user:${userId}`);

        return reply.code(201).send({ success: true, orderId, message: 'Đặt hàng thành công' });

      } catch (err: any) {
        fastify.log.error(err);
        return reply.code(400).send({ success: false, message: err.message || 'Lỗi xử lý đơn hàng' });
      }
    }
  );

  /**
   * GET /api/orders
   * Lấy danh sách đơn hàng của user đăng nhập
   */
  fastify.get(
    '/api/orders',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user?.sub;
        if (!userId) {
          return reply.code(401).send({ success: false, message: 'Chưa đăng nhập' });
        }
        const orders = await OrderRepository.findOrdersByUserId(userId);
        return reply.send({ success: true, data: orders });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ success: false, message: 'Lỗi tải danh sách đơn hàng' });
      }
    }
  );

  /**
   * GET /api/orders/:id
   * Lấy chi tiết đơn hàng (chỉ chủ sở hữu hoặc admin)
   */
  fastify.get<{ Params: { id: string } }>(
    '/api/orders/:id',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const userId = request.user?.sub;
        const { id } = request.params;
        if (!userId) {
          return reply.code(401).send({ success: false, message: 'Chưa đăng nhập' });
        }
        // Cho phép ADMIN xem bất cứ order nào, còn user thường chỉ xem của chính họ
        const isAdmin = (request.user as any)?.role === 'ADMIN' || (request.user as any)?.role === 'CONTENT_EDITOR';
        const order = await OrderRepository.findOrderById(id, isAdmin ? undefined : userId);

        if (!order) {
          return reply.code(404).send({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        return reply.send({ success: true, data: order });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ success: false, message: 'Lỗi tải chi tiết đơn hàng' });
      }
    }
  );

  /**
   * GET /api/admin/orders
   * Yêu cầu: JWT + ADMIN/CONTENT_EDITOR
   * Lấy toàn bộ đơn hàng
   */
  fastify.get<{ Querystring: { status?: string; page?: string; limit?: string } }>(
    '/api/admin/orders',
    { onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])] },
    async (request, reply) => {
      try {
        const { status } = request.query;
        const page = Math.max(1, Number(request.query.page ?? 1));
        const limit = Math.min(50, Math.max(1, Number(request.query.limit ?? 20)));

        const result = await OrderRepository.findAllOrders(status, page, limit);
        return reply.send({
          success: true,
          count: result.total,
          data: result.rows,
          meta: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) },
        });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ success: false, message: 'Lỗi tải danh sách đơn hàng' });
      }
    }
  );

  /**
   * PATCH /api/admin/orders/:id/status
   * Yêu cầu: JWT + ADMIN/CONTENT_EDITOR
   * Cập nhật trạng thái đơn hàng (PENDING -> PROCESSING -> SHIPPING -> DELIVERED -> CANCELLED)
   */
  fastify.patch<{ Params: { id: string }; Body: { status: string } }>(
    '/api/admin/orders/:id/status',
    { onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])] },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { status } = request.body || {};

        if (!status) {
          return reply.code(400).send({ success: false, message: 'Trạng thái là bắt buộc' });
        }

        const updated = await OrderRepository.updateOrderStatus(id, status);
        if (!updated) {
          return reply.code(404).send({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        return reply.send({ success: true, data: updated, message: 'Cập nhật trạng thái thành công' });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ success: false, message: 'Lỗi cập nhật trạng thái đơn hàng' });
      }
    }
  );
}