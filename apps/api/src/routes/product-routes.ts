// apps/api/src/routes/product-routes.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { ProductRepository } from '../repositories/product.repository.js';

interface GetProductsQuery {
  search?: string;
  category_id?: string;
  page?: string;
  limit?: string;
}

interface GetProductParams {
  id: string;
}

export async function productRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  /**
   * GET /api/products
   * Public — chỉ trả về sản phẩm status = 'published'.
   * Hỗ trợ: ?search=, ?category_id=, ?page=, ?limit=
   */
  fastify.get<{ Querystring: GetProductsQuery }>(
    '/api/products',
    async (request, reply) => {
      try {
        const { search } = request.query;
        const categoryId = request.query.category_id
          ? Number(request.query.category_id)
          : undefined;
        const page = Math.max(1, Number(request.query.page ?? 1));
        const limit = Math.min(100, Math.max(1, Number(request.query.limit ?? 20)));

        if (categoryId !== undefined && !Number.isInteger(categoryId)) {
          return reply.code(400).send({
            success: false,
            message: 'category_id phải là số nguyên hợp lệ.',
          });
        }

        const { rows, total } = await ProductRepository.findProducts(
          search,
          categoryId,
          page,
          limit,
        );

        return reply.code(200).send({
          success: true,
          data: rows,
          meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi khi truy vấn sản phẩm');
        return reply.code(500).send({
          success: false,
          message: 'Lỗi máy chủ nội bộ khi truy vấn sản phẩm.',
        });
      }
    },
  );

  /**
   * GET /api/products/:id
   * Public — chỉ trả về sản phẩm status = 'published'.
   */
  fastify.get<{ Params: GetProductParams }>(
    '/api/products/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const product = await ProductRepository.findProductById(id);

        if (!product) {
          return reply.code(404).send({
            success: false,
            message: 'Không tìm thấy sản phẩm.',
          });
        }

        return reply.code(200).send({ success: true, data: product });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi khi lấy chi tiết sản phẩm');
        return reply.code(500).send({
          success: false,
          message: 'Lỗi máy chủ nội bộ khi lấy chi tiết sản phẩm.',
        });
      }
    },
  );
}
