// apps/api/src/plugins/auth.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { JwtUserPayload } from '../types/auth.js';

export default fp(async (fastify: FastifyInstance) => {
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret-ngok-bay-key-2026'
  });

  fastify.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const decoded = await request.jwtVerify<JwtUserPayload>();
        request.user = decoded;
      } catch {
        return reply.code(401).send({
          success: false,
          message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.'
        });
      }
    }
  );

  fastify.decorate(
    'requireRole',
    (roles: string[]) => {
      return async (request: FastifyRequest, reply: FastifyReply) => {
        if (!request.user || !roles.includes(request.user.role)) {
          return reply.code(403).send({
            success: false,
            message: 'Bạn không có quyền thực hiện hành động này.'
          });
        }
      };
    }
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
    requireRole: (roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}