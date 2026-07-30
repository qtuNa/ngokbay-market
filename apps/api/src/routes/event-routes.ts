// apps/api/src/routes/event-routes.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { MarketRepository } from '../repositories/market.repository.js';
import { MapsService } from '@repo/maps';
import { createHash } from 'crypto';

interface CreateEventBody {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  opening_hours?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  image_url?: string;
}

export async function eventRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  /**
   * POST /api/admin/events/resolve-map-link
   * Phân giải link chia sẻ Google Maps / OpenStreetMap thành tọa độ GPS.
   */
  fastify.post<{ Body: { url: string } }>(
    '/api/admin/events/resolve-map-link',
    { onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])] },
    async (request, reply) => {
      try {
        const { url } = request.body ?? {};
        if (!url?.trim()) {
          return reply.code(400).send({ success: false, message: 'Vui lòng cung cấp link bản đồ.' });
        }
        const result = await (MapsService as any).resolveMapLink(url.trim());
        if (!result) {
          return reply.code(404).send({ success: false, message: 'Không thể trích xuất tọa độ từ đường link này. Vui lòng kiểm tra lại link!' });
        }
        return reply.send({ success: true, data: result, message: 'Trích xuất tọa độ thành công!' });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi phân giải map link');
        return reply.code(500).send({ success: false, message: 'Lỗi hệ thống khi phân giải link bản đồ.' });
      }
    }
  );

  /**
   * POST /api/admin/events
   * Yêu cầu: JWT hợp lệ + role ADMIN hoặc CONTENT_EDITOR
   * Tạo sự kiện phiên chợ mới với tự động geocode tọa độ và cache Redis.
   */
  fastify.post<{ Body: CreateEventBody }>(
    '/api/admin/events',
    { onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])] },
    async (request, reply) => {
      try {
        const { name, address } = request.body ?? {};
        let { latitude, longitude, opening_hours, start_date, end_date, description, image_url } = request.body ?? {};

        if (!name?.trim() || !address?.trim()) {
          return reply.code(400).send({
            success: false,
            message: 'Tên và địa chỉ phiên chợ là bắt buộc.',
          });
        }

        // Tạo MD5 hash từ địa chỉ (lowercase, trim) làm key cache Redis
        const locationHash = createHash('md5')
          .update(address.trim().toLowerCase())
          .digest('hex');
        const cacheKey = `geocode:${locationHash}`;

        let formattedAddress = address.trim();

        // 1. Nếu admin gửi tọa độ trực tiếp từ map picker, ưu tiên sử dụng luôn!
        if (latitude === undefined || longitude === undefined) {
          // Kiểm tra geocode cache Redis
          const cached = await fastify.redis.get(cacheKey);
          if (cached) {
            try {
              const parsed = JSON.parse(cached) as {
                latitude: number;
                longitude: number;
                formattedAddress: string;
              };
              latitude = parsed.latitude;
              longitude = parsed.longitude;
              formattedAddress = parsed.formattedAddress;
              fastify.log.info({ cacheKey }, 'Geocode cache hit');
            } catch (e) {
              fastify.log.error(e, 'Lỗi parse cache geocode — sẽ gọi lại MapsService');
            }
          }
        }

        // 2. Nếu không có cache và không có tọa độ truyền vào, gọi MapsService
        if (latitude === undefined || longitude === undefined) {
          fastify.log.info({ address }, 'Geocode cache miss, calling MapsService');
          const geocodeResult = await MapsService.geocode(address.trim());
          latitude = geocodeResult.latitude;
          longitude = geocodeResult.longitude;
          formattedAddress = geocodeResult.formattedAddress;

          // Lưu vào Redis cache với TTL 2 giờ (7200 giây)
          await fastify.redis.setex(
            cacheKey,
            7200,
            JSON.stringify({ latitude, longitude, formattedAddress }),
          );
        }

        // 3. Tạo maps_url cho điều hướng Google Maps
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

        // 4. Lưu DB
        const newEvent = await MarketRepository.createMarketEvent({
          name: name.trim(),
          address: formattedAddress,
          latitude,
          longitude,
          opening_hours,
          start_date,
          end_date,
          description,
          image_url,
        });

        return reply.code(201).send({
          success: true,
          data: {
            ...(newEvent as Record<string, unknown>),
            maps_url: mapsUrl,
          },
        });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi hệ thống khi tạo phiên chợ');
        return reply.code(500).send({
          success: false,
          message: 'Lỗi hệ thống khi tạo phiên chợ.',
        });
      }
    },
  );

  /**
   * PUT /api/admin/events/:id
   * Cập nhật phiên chợ
   */
  fastify.put<{ Params: { id: string }; Body: Partial<CreateEventBody> }>(
    '/api/admin/events/:id',
    { onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])] },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { name, address } = request.body ?? {};
        let { latitude, longitude, opening_hours, start_date, end_date, description, image_url } = request.body ?? {};
        let formattedAddress = address?.trim();

        if ((latitude === undefined || longitude === undefined) && address?.trim()) {
          const geocodeResult = await MapsService.geocode(address.trim());
          latitude = geocodeResult.latitude;
          longitude = geocodeResult.longitude;
          formattedAddress = geocodeResult.formattedAddress;
        }

        const updated = await MarketRepository.updateMarketEvent(id, {
          name: name?.trim(),
          address: formattedAddress,
          latitude,
          longitude,
          opening_hours,
          start_date,
          end_date,
          description,
          image_url,
        });

        if (!updated) {
          return reply.code(404).send({ success: false, message: 'Không tìm thấy phiên chợ.' });
        }

        return reply.send({ success: true, data: updated, message: 'Cập nhật thành công.' });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi khi cập nhật phiên chợ');
        return reply.code(500).send({ success: false, message: 'Lỗi hệ thống.' });
      }
    },
  );

  /**
   * DELETE /api/admin/events/:id
   * Xóa phiên chợ
   */
  fastify.delete<{ Params: { id: string } }>(
    '/api/admin/events/:id',
    { onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])] },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const deleted = await MarketRepository.deleteMarketEvent(id);
        if (!deleted) {
          return reply.code(404).send({ success: false, message: 'Không tìm thấy phiên chợ để xóa.' });
        }
        return reply.send({ success: true, message: 'Xóa phiên chợ thành công.' });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi khi xóa phiên chợ');
        return reply.code(500).send({ success: false, message: 'Lỗi hệ thống.' });
      }
    },
  );
}

export default eventRoutes;

