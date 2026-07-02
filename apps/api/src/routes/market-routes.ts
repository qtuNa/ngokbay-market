import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { MarketRepository } from '../repositories/market.repository.js';

interface GetMarketsQuery {
  search?: string;
}

export async function marketRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  
  fastify.get('/api/markets', async (
    request: FastifyRequest<{ Querystring: GetMarketsQuery }>, 
    reply: FastifyReply
  ) => {
    try {
      const { search } = request.query;
      
      // Gọi tới lớp Repository để lấy dữ liệu
      const result = await MarketRepository.findMarkets(search);

      return reply.code(200).send({
        success: true,
        count: result.rowCount,
        data: result.rows
      });

    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Lỗi máy chủ nội bộ khi truy vấn danh sách phiên chợ.'
      });
    }
  });
}