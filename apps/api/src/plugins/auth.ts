// apps/api/src/plugins/auth.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { JwtUserPayload, UserRole } from '../types/auth.js';

export default fp(async (fastify: FastifyInstance) => {
  // JWT_SECRET được validate ở index.ts — đây sẽ không bao giờ là undefined khi vào đây
  const secret = process.env.JWT_SECRET!;

  await fastify.register(jwt, { secret });

  /** Xác thực JWT — reject 401 nếu token không hợp lệ hoặc hết hạn */
  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const decoded = await request.jwtVerify<JwtUserPayload>();
        request.user = decoded;
      } catch {
        return reply.code(401).send({
          success: false,
          message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.',
        });
      }
    },
  );

  /**
   * Kiểm tra quyền theo role — dùng sau `authenticate`.
   * Trả về 403 Forbidden nếu role không nằm trong danh sách cho phép.
   *
   * Dùng:
   *   { onRequest: [fastify.authenticate, fastify.requireRole(['ADMIN'])] }
   */
  fastify.decorate(
    'requireRole',
    (allowedRoles: UserRole[]) =>
      async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.user || !allowedRoles.includes(request.user.role)) {
          return reply.code(403).send({
            success: false,
            message: 'Bạn không có quyền thực hiện hành động này.',
            code: 'FORBIDDEN',
          });
        }
      },
  );

  /** Xác thực tùy chọn — không reject nếu không có token, chỉ populate request.user nếu có */
  fastify.decorate(
    'optionalAuthenticate',
    async (request: FastifyRequest, _reply: FastifyReply) => {
      try {
        const decoded = await request.jwtVerify<JwtUserPayload>();
        request.user = decoded;
      } catch {
        // Không có token hoặc token không hợp lệ — bỏ qua, request.user sẽ là undefined
      }
    },
  );
});

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtUserPayload;
    user: JwtUserPayload;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtUserPayload;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (roles: UserRole[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    optionalAuthenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}