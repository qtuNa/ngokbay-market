// apps/api/src/routes/settings-routes.ts
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SettingsRepository } from '../repositories/settings.repository.js';

/**
 * Các key được phép GET/PATCH công khai (không cần auth để đọc).
 * Chỉ ADMIN / CONTENT_EDITOR mới được PATCH.
 */
const PUBLIC_READABLE_KEYS = ['hero_banner', 'culture_highlights', 'site_meta'] as const;
type PublicKey = (typeof PUBLIC_READABLE_KEYS)[number];

interface GetSettingParams {
  key: string;
}

interface PatchSettingParams {
  key: string;
}

interface PatchSettingBody {
  value: unknown;
}

export async function settingsRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions,
) {
  /**
   * GET /api/settings/:key
   * Public — trả về value của setting key.
   * Chỉ cho phép đọc các PUBLIC_READABLE_KEYS.
   */
  fastify.get<{ Params: GetSettingParams }>(
    '/api/settings/:key',
    async (request, reply) => {
      const { key } = request.params;

      if (!(PUBLIC_READABLE_KEYS as readonly string[]).includes(key)) {
        return reply.code(404).send({ success: false, message: 'Setting không tồn tại.' });
      }

      try {
        const setting = await SettingsRepository.getByKey(key);
        if (!setting) {
          return reply.code(404).send({ success: false, message: 'Setting không tồn tại.' });
        }
        return reply.send({ success: true, data: setting.value });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi khi lấy setting');
        return reply.code(500).send({ success: false, message: 'Lỗi máy chủ.' });
      }
    },
  );

  /**
   * GET /api/settings
   * Public — trả về toàn bộ public settings một lần.
   */
  fastify.get(
    '/api/settings',
    async (_request, reply) => {
      try {
        const data = await SettingsRepository.getByKeys([...PUBLIC_READABLE_KEYS]);
        return reply.send({ success: true, data });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi khi lấy tất cả settings');
        return reply.code(500).send({ success: false, message: 'Lỗi máy chủ.' });
      }
    },
  );

  /**
   * PATCH /api/admin/settings/:key
   * Yêu cầu: JWT + ADMIN hoặc CONTENT_EDITOR
   * Cập nhật value của một setting key.
   */
  fastify.patch<{ Params: PatchSettingParams; Body: PatchSettingBody }>(
    '/api/admin/settings/:key',
    {
      onRequest: [
        fastify.authenticate,
        fastify.requireRole(['ADMIN', 'CONTENT_EDITOR']),
      ],
    },
    async (request, reply) => {
      const { key } = request.params;
      const { value } = request.body ?? {};

      if (!(PUBLIC_READABLE_KEYS as readonly string[]).includes(key)) {
        return reply.code(400).send({ success: false, message: 'Key không hợp lệ.' });
      }

      if (value === undefined || value === null) {
        return reply.code(400).send({ success: false, message: 'Trường value là bắt buộc.' });
      }

      try {
        const updated = await SettingsRepository.upsert(key, value, request.user.sub);
        return reply.send({ success: true, data: updated });
      } catch (error) {
        fastify.log.error({ err: error }, 'Lỗi khi cập nhật setting');
        return reply.code(500).send({ success: false, message: 'Lỗi máy chủ.' });
      }
    },
  );
}
