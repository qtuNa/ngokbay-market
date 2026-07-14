// apps/api/src/routes/order-routes.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { checkoutSchema, type CheckoutInput } from '@repo/validation';
import {
  OrderRepository,
  ProductNotFoundError,
  InsufficientStockError,
} from '../repositories/order.repository.js';

interface GetOrderParams {
  id: string;
}

interface GetOrdersQuery {
  page?: string;
  limit?: string;
}

export async function orderRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/orders/checkout
   * Yêu cầu: JWT hợp lệ (bất kỳ role nào)
   * - Giá được fetch từ DB, không từ client
   * - Stock được lock bằng SELECT FOR UPDATE
   */
  fastify.post(
    '/api/orders/checkout',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Validation layer
      const result = checkoutSchema.safeParse(request.body);
      if (!result.success) {
        return reply.code(400).send({
          success: false,
          message: 'Dữ liệu đơn hàng không hợp lệ',
          errors: result.error.format(),
        });
      }

      const validatedData: CheckoutInput = result.data;
      const userId = request.user?.sub;

      if (!userId) {
        return reply.code(401).send({ success: false, message: 'Không tìm thấy thông tin xác thực' });
      }

      try {
        const productIds = validatedData.items.map((i) => i.product_id);

        // 1. Fetch giá thực từ DB
        const priceMap = await OrderRepository.fetchProductPrices(productIds);

        // 2. Kiểm tra tất cả sản phẩm có tồn tại và published không
        const missingProducts = productIds.filter((id) => !priceMap.has(id));
        if (missingProducts.length > 0) {
          return reply.code(404).send({
            success: false,
            message: `Sản phẩm không tồn tại hoặc chưa được đăng bán: ${missingProducts.join(', ')}`,
            code: 'PRODUCT_NOT_FOUND',
          });
        }

        // 3. Enrich items với giá từ DB + tính totalAmount server-side
        const enrichedItems = validatedData.items.map((item) => ({
          ...item,
          price: priceMap.get(item.product_id)!,
        }));

        const totalAmount = enrichedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        // 4. DB Transaction: lock stock + tạo đơn hàng
        const orderId = await OrderRepository.checkout(userId, enrichedItems, totalAmount);

        // 5. Xóa giỏ hàng Redis của user
        await fastify.redis.del(`cart:user:${userId}`);

        return reply.code(201).send({ success: true, orderId, message: 'Đặt hàng thành công' });
      } catch (err) {
        if (err instanceof ProductNotFoundError) {
          return reply.code(404).send({
            success: false,
            message: err.message,
            code: 'PRODUCT_NOT_FOUND',
          });
        }
        if (err instanceof InsufficientStockError) {
          return reply.code(409).send({
            success: false,
            message: err.message,
            code: 'INSUFFICIENT_STOCK',
          });
        }

        fastify.log.error({ err }, 'Lỗi hệ thống khi xử lý đơn hàng');
        return reply.code(500).send({ success: false, message: 'Lỗi hệ thống khi xử lý đơn hàng' });
      }
    },
  );

  /**
   * GET /api/orders
   * Lấy danh sách đơn hàng của user (có phân trang)
   */
  fastify.get<{ Querystring: GetOrdersQuery }>(
    '/api/orders',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const userId = request.user?.sub;
      if (!userId) {
        return reply.code(401).send({ success: false, message: 'Không tìm thấy thông tin xác thực' });
      }

      const page = Math.max(1, Number(request.query.page ?? 1));
      const limit = Math.min(50, Math.max(1, Number(request.query.limit ?? 20)));

      try {
        const { rows, total } = await OrderRepository.findOrdersByUserId(userId, page, limit);
        return reply.code(200).send({
          success: true,
          data: rows,
          meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
      } catch (err) {
        fastify.log.error({ err }, 'Lỗi hệ thống khi lấy danh sách đơn hàng');
        return reply.code(500).send({ success: false, message: 'Lỗi hệ thống khi lấy danh sách đơn hàng' });
      }
    },
  );

  /**
   * GET /api/orders/:id
   * Lấy chi tiết đơn hàng (user chỉ thấy đơn của chính mình)
   */
  fastify.get<{ Params: GetOrderParams }>(
    '/api/orders/:id',
    { onRequest: [fastify.authenticate] },
    async (request, reply) => {
      const userId = request.user?.sub;
      const { id } = request.params;

      if (!userId) {
        return reply.code(401).send({ success: false, message: 'Không tìm thấy thông tin xác thực' });
      }

      try {
        const order = await OrderRepository.findOrderById(id, userId);
        if (!order) {
          return reply.code(404).send({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        return reply.code(200).send({ success: true, data: order });
      } catch (err) {
        fastify.log.error({ err }, 'Lỗi hệ thống khi lấy chi tiết đơn hàng');
        return reply.code(500).send({ success: false, message: 'Lỗi hệ thống khi lấy chi tiết đơn hàng' });
      }
    },
  );
}