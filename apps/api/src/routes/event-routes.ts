// apps/api/src/routes/event-routes.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { MarketRepository } from '../repositories/market.repository.js';
import { MapsService } from '@repo/maps';
import { createHash } from 'crypto';

interface CreateEventBody {
  name: string;
  address: string;
}

export async function eventRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
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

        let latitude: number | undefined;
        let longitude: number | undefined;
        let formattedAddress = address.trim();

        // 1. Kiểm tra geocode cache Redis
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

        // 2. Nếu không có cache, gọi MapsService
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
}

export default eventRoutes;
