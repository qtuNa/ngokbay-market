import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { ProductRepository, CreateProductInput } from '../repositories/product.repository.js';

interface GetProductsQuery {
  search?: string;
  category_id?: string;
}

interface GetProductParams {
  id: string;
}

export async function productRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  /**
   * GET /api/products
   * Danh sách sản phẩm (có lọc theo từ khóa, danh mục)
   */
  fastify.get('/api/products', async (
    request: FastifyRequest<{ Querystring: GetProductsQuery }>,
    reply: FastifyReply,
  ) => {
    try {
      const search = request.query.search;
      const categoryId = request.query.category_id ? Number(request.query.category_id) : undefined;

      const result = await ProductRepository.findProducts(search, categoryId);

      return reply.code(200).send({
        success: true,
        count: result.rowCount,
        data: result.rows,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Lỗi máy chủ nội bộ khi truy vấn sản phẩm.',
      });
    }
  });

  /**
   * GET /api/products/:id
   * Chi tiết sản phẩm theo id hoặc slug
   */
  fastify.get('/api/products/:id', async (
    request: FastifyRequest<{ Params: GetProductParams }>,
    reply: FastifyReply,
  ) => {
    try {
      const { id } = request.params;
      const product = await ProductRepository.findByIdOrSlug(id);

      if (!product) {
        return reply.code(404).send({
          success: false,
          message: 'Không tìm thấy sản phẩm',
        });
      }

      return reply.code(200).send({
        success: true,
        data: product,
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Lỗi máy chủ nội bộ khi lấy chi tiết sản phẩm.',
      });
    }
  });

  /**
   * POST /api/admin/products
   * Yêu cầu: JWT + ADMIN/CONTENT_EDITOR
   * Tạo sản phẩm mới
   */
  fastify.post<{ Body: CreateProductInput }>('/api/admin/products', {
    onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])],
  }, async (
    request,
    reply,
  ) => {
    try {
      const data = request.body;
      if (!data?.name || data?.price === undefined) {
        return reply.code(400).send({
          success: false,
          message: 'Tên và giá sản phẩm là bắt buộc',
        });
      }

      const product = await ProductRepository.createProduct(data);
      return reply.code(201).send({
        success: true,
        data: product,
        message: 'Tạo sản phẩm thành công',
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: error.message || 'Lỗi khi tạo sản phẩm',
      });
    }
  });

  /**
   * PUT /api/admin/products/:id
   * Yêu cầu: JWT + ADMIN/CONTENT_EDITOR
   * Cập nhật sản phẩm
   */
  fastify.put<{ Params: GetProductParams; Body: Partial<CreateProductInput> }>('/api/admin/products/:id', {
    onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])],
  }, async (
    request,
    reply,
  ) => {
    try {
      const { id } = request.params;
      const data = request.body;

      const updated = await ProductRepository.updateProduct(id, data);
      if (!updated) {
        return reply.code(404).send({
          success: false,
          message: 'Không tìm thấy sản phẩm để cập nhật',
        });
      }

      return reply.code(200).send({
        success: true,
        data: updated,
        message: 'Cập nhật sản phẩm thành công',
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: error.message || 'Lỗi khi cập nhật sản phẩm',
      });
    }
  });

  /**
   * DELETE /api/admin/products/:id
   * Yêu cầu: JWT + ADMIN/CONTENT_EDITOR
   * Xóa sản phẩm
   */
  fastify.delete<{ Params: GetProductParams }>('/api/admin/products/:id', {
    onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])],
  }, async (
    request,
    reply,
  ) => {
    try {
      const { id } = request.params;
      const deleted = await ProductRepository.deleteProduct(id);

      if (!deleted) {
        return reply.code(404).send({
          success: false,
          message: 'Không tìm thấy sản phẩm để xóa',
        });
      }

      return reply.code(200).send({
        success: true,
        message: 'Xóa sản phẩm thành công',
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: error.message || 'Lỗi khi xóa sản phẩm',
      });
    }
  });
}

