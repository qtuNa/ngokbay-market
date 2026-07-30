import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { ContactRepository, CreateContactInput } from '../repositories/contact.repository.js';

interface GetContactsQuery {
  status?: string;
  type?: string;
  page?: string;
  limit?: string;
}

interface GetContactParams {
  id: string;
}

interface PatchStatusBody {
  status: string;
}

export async function contactRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  /**
   * POST /api/contact
   * Public — gửi liên hệ từ người dùng
   */
  fastify.post<{ Body: CreateContactInput }>('/api/contact', async (
    request,
    reply,
  ) => {
    try {
      const data = request.body;
      if (!data?.name?.trim() || !data?.message?.trim()) {
        return reply.code(400).send({
          success: false,
          message: 'Họ tên và nội dung tin nhắn là bắt buộc.',
        });
      }

      const newMsg = await ContactRepository.createMessage(data);
      return reply.code(201).send({
        success: true,
        data: newMsg,
        message: 'Gửi tin nhắn liên hệ thành công.',
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Lỗi máy chủ khi gửi tin nhắn liên hệ.',
      });
    }
  });

  /**
   * GET /api/admin/contacts
   * Yêu cầu: JWT + ADMIN/CONTENT_EDITOR
   */
  fastify.get<{ Querystring: GetContactsQuery }>('/api/admin/contacts', {
    onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])],
  }, async (
    request,
    reply,
  ) => {
    try {
      const { status, type } = request.query;
      const page = Math.max(1, Number(request.query.page ?? 1));
      const limit = Math.min(50, Math.max(1, Number(request.query.limit ?? 20)));

      const result = await ContactRepository.findMessages(status, type, page, limit);

      return reply.code(200).send({
        success: true,
        count: result.total,
        data: result.rows,
        meta: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) },
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Lỗi máy chủ khi tải danh sách tin nhắn.',
      });
    }
  });

  /**
   * PATCH /api/admin/contacts/:id
   * Yêu cầu: JWT + ADMIN/CONTENT_EDITOR
   */
  fastify.patch<{ Params: GetContactParams; Body: PatchStatusBody }>('/api/admin/contacts/:id', {
    onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])],
  }, async (
    request,
    reply,
  ) => {
    try {
      const { id } = request.params;
      const { status } = request.body || {};

      if (!status) {
        return reply.code(400).send({
          success: false,
          message: 'Trạng thái status là bắt buộc.',
        });
      }

      const updated = await ContactRepository.updateStatus(id, status);
      if (!updated) {
        return reply.code(404).send({
          success: false,
          message: 'Không tìm thấy tin nhắn.',
        });
      }

      return reply.code(200).send({
        success: true,
        data: updated,
        message: 'Cập nhật trạng thái thành công.',
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Lỗi máy chủ khi cập nhật tin nhắn.',
      });
    }
  });

  /**
   * DELETE /api/admin/contacts/:id
   * Yêu cầu: JWT + ADMIN/CONTENT_EDITOR
   */
  fastify.delete<{ Params: GetContactParams }>('/api/admin/contacts/:id', {
    onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN', 'CONTENT_EDITOR'])],
  }, async (
    request,
    reply,
  ) => {
    try {
      const { id } = request.params;
      const deleted = await ContactRepository.deleteMessage(id);
      if (!deleted) {
        return reply.code(404).send({
          success: false,
          message: 'Không tìm thấy tin nhắn để xóa.',
        });
      }
      return reply.code(200).send({
        success: true,
        message: 'Xóa tin nhắn thành công.',
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Lỗi máy chủ khi xóa tin nhắn.',
      });
    }
  });
}
