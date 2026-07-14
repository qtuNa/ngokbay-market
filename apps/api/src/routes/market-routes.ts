// apps/api/src/routes/market-routes.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { MarketRepository } from '../repositories/market.repository.js';

interface GetMarketsQuery {
  search?: string;
  page?: string;
  limit?: string;
}

interface GetMarketParams {
  id: string;
}

export async function marketRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  /**
   * GET /api/markets
   * Lấy danh sách phiên chợ, hỗ trợ tìm kiếm và phân trang.
   */
  fastify.get<{ Querystring: GetMarketsQuery }>(
    '/api/markets',
    async (request, reply) => {
      try {
        const { search } = request.query;
        const page = Math.max(1, Number(request.query.page ?? 1));
        const limit = Math.min(50, Math.max(1, Number(request.query.limit ?? 20)));

        const result = await MarketRepository.findMarkets(search, page, limit);

        return reply.code(200).send({
          success: true,
          count: result.total,
          data: result.rows,
          meta: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) },
        });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi hệ thống khi truy vấn danh sách phiên chợ');
        return reply.code(500).send({
          success: false,
          message: 'Lỗi máy chủ nội bộ khi truy vấn danh sách phiên chợ.',
        });
      }
    },
  );

  /**
   * GET /api/markets/:id
   * Lấy chi tiết một phiên chợ kèm maps_url.
   */
  fastify.get<{ Params: GetMarketParams }>(
    '/api/markets/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const market = await MarketRepository.findMarketById(id);

        if (!market) {
          return reply.code(404).send({
            success: false,
            message: 'Không tìm thấy phiên chợ.',
          });
        }

        return reply.code(200).send({ success: true, data: market });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi hệ thống khi lấy chi tiết phiên chợ');
        return reply.code(500).send({
          success: false,
          message: 'Lỗi máy chủ nội bộ khi lấy chi tiết phiên chợ.',
        });
      }
    },
  );
}