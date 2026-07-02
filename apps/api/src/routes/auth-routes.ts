import type { FastifyPluginAsync } from "fastify";

import {
  generateOtpCode,
  isPhoneOtpBlocked,
  OTP_TTL_SECONDS,
  saveOtpToRedis,
  verifyOtpFromRedis,
} from "../services/otp-service.js";
import { sendOtpViaZaloOA, ZaloOAError } from "../services/zalo-oa.js";
import { findOrCreateUserByPhone } from "../services/user-service.js";
import type {
  AuthErrorResponse,
  JwtUserPayload,
  SendOtpRequestBody,
  SendOtpResponse,
  VerifyOtpRequestBody,
  VerifyOtpResponse,
} from "../types/auth.js";
import { isValidVietnamesePhone, normalizeVietnamesePhone } from "../utils/phone.js";

function badRequest(message: string, code?: string): AuthErrorResponse {
  return { success: false, error: message, code };
}

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/auth/send-otp
   * Nhận SĐT → sinh OTP 6 số → lưu Redis (TTL 300s) → gửi qua Zalo OA
   */
  fastify.post<{ Body: SendOtpRequestBody; Reply: SendOtpResponse }>(
    "/api/auth/send-otp",
    async (request, reply) => {
      try {
        const { phone: rawPhone } = request.body ?? {};

        if (!rawPhone || typeof rawPhone !== "string") {
          return reply
            .status(400)
            .send(badRequest("So dien thoai la bat buoc", "PHONE_REQUIRED"));
        }

        const phone = normalizeVietnamesePhone(rawPhone);

        if (!isValidVietnamesePhone(phone)) {
          return reply
            .status(400)
            .send(badRequest("So dien thoai khong hop le", "PHONE_INVALID"));
        }

        if (await isPhoneOtpBlocked(fastify.redis, phone)) {
          return reply.status(429).send(
            badRequest(
              "So dien thoai bi tam khoa do nhap sai OTP qua nhieu lan. Vui long thu lai sau 15 phut.",
              "OTP_BLOCKED",
            ),
          );
        }

        const otpCode = generateOtpCode();

        await saveOtpToRedis(fastify.redis, phone, otpCode);

        try {
          await sendOtpViaZaloOA({ phone, code: otpCode });
        } catch (error) {
          await fastify.redis.del(`otp:${phone}`);

          if (error instanceof ZaloOAError) {
            fastify.log.error({ err: error, phone }, "Zalo OA gui OTP that bai");
            return reply
              .status(502)
              .send(
                badRequest(
                  "Khong the gui ma OTP. Vui long thu lai sau.",
                  "OTP_DELIVERY_FAILED",
                ),
              );
          }

          throw error;
        }

        return reply.status(200).send({
          success: true,
          message: "Ma OTP da duoc gui toi so dien thoai cua ban",
          expiresIn: OTP_TTL_SECONDS,
        });
      } catch (error) {
        fastify.log.error({ err: error }, "Loi he thong khi gui OTP");
        return reply
          .status(500)
          .send(badRequest("Loi he thong. Vui long thu lai sau.", "INTERNAL_ERROR"));
      }
    },
  );

  /**
   * POST /api/auth/verify-otp
   * Nhận SĐT + OTP → đối chiếu Redis → phát hành JWT nếu hợp lệ
   */
  fastify.post<{ Body: VerifyOtpRequestBody; Reply: VerifyOtpResponse }>(
    "/api/auth/verify-otp",
    async (request, reply) => {
      try {
        const { phone: rawPhone, otp } = request.body ?? {};

        if (!rawPhone || typeof rawPhone !== "string") {
          return reply
            .status(400)
            .send(badRequest("So dien thoai la bat buoc", "PHONE_REQUIRED"));
        }

        if (!otp || typeof otp !== "string") {
          return reply
            .status(400)
            .send(badRequest("Ma OTP la bat buoc", "OTP_REQUIRED"));
        }

        const phone = normalizeVietnamesePhone(rawPhone);
        const normalizedOtp = otp.trim();

        if (!isValidVietnamesePhone(phone)) {
          return reply
            .status(400)
            .send(badRequest("So dien thoai khong hop le", "PHONE_INVALID"));
        }

        if (!/^\d{6}$/.test(normalizedOtp)) {
          return reply
            .status(400)
            .send(badRequest("Ma OTP phai gom 6 chu so", "OTP_INVALID_FORMAT"));
        }

        const verification = await verifyOtpFromRedis(
          fastify.redis,
          phone,
          normalizedOtp,
        );

        switch (verification.status) {
          case "blocked":
            return reply.status(429).send(
              badRequest(
                "So dien thoai bi tam khoa do nhap sai OTP qua nhieu lan.",
                "OTP_BLOCKED",
              ),
            );

          case "max_attempts_exceeded":
            return reply.status(400).send(
              badRequest(
                "Ban da nhap sai OTP qua 3 lan. Vui long yeu cau ma moi.",
                "OTP_MAX_ATTEMPTS",
              ),
            );

          case "expired":
            return reply.status(400).send(
              badRequest(
                "Ma OTP da het han hoac khong ton tai. Vui long yeu cau ma moi.",
                "OTP_EXPIRED",
              ),
            );

          case "invalid":
            return reply.status(400).send(
              badRequest(
                `Ma OTP khong dung. Con lai ${verification.remainingAttempts} lan thu.`,
                "OTP_MISMATCH",
              ),
            );

          case "valid":
            break;

          default: {
            const _exhaustive: never = verification;
            return _exhaustive;
          }
        }

        const user = await findOrCreateUserByPhone(phone);

        const payload: JwtUserPayload = {
          sub: user.id,
          phone: user.phone,
          role: user.role,
        };

        const token = fastify.jwt.sign(payload, {
          expiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
        });

        return reply.status(200).send({
          success: true,
          token,
          user,
        });
      } catch (error) {
        fastify.log.error({ err: error }, "Loi he thong khi xac thuc OTP");
        return reply
          .status(500)
          .send(badRequest("Loi he thong. Vui long thu lai sau.", "INTERNAL_ERROR"));
      }
    },
  );
};

export default authRoutes;
