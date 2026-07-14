// redis type dùng any để tương thích cả ioredis.Redis lẫn MemoryRedis fallback

import type { OtpRedisRecord, OtpVerificationResult } from "../types/auth.js";

export const OTP_TTL_SECONDS = 300;
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_BLOCK_TTL_SECONDS = 900;

export function buildOtpRedisKey(phone: string): string {
  return `otp:${phone}`;
}

export function buildOtpBlockKey(phone: string): string {
  return `otp:block:${phone}`;
}

/** Sinh mã OTP ngẫu nhiên 6 chữ số, giữ số 0 đầu nếu có */
export function generateOtpCode(): string {
  const value = Math.floor(Math.random() * 1_000_000);
  return value.toString().padStart(6, "0");
}

export function parseOtpRedisRecord(raw: string | null): OtpRedisRecord | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "code" in parsed &&
      "attempts" in parsed &&
      typeof (parsed as OtpRedisRecord).code === "string" &&
      typeof (parsed as OtpRedisRecord).attempts === "number"
    ) {
      return parsed as OtpRedisRecord;
    }

    return null;
  } catch {
    return null;
  }
}

export async function isPhoneOtpBlocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redis: any,
  phone: string,
): Promise<boolean> {
  const blocked = await redis.get(buildOtpBlockKey(phone));
  return blocked !== null;
}

export async function saveOtpToRedis(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redis: any,
  phone: string,
  code: string,
): Promise<void> {
  const record: OtpRedisRecord = { code, attempts: 0 };
  await redis.set(
    buildOtpRedisKey(phone),
    JSON.stringify(record),
    "EX",
    OTP_TTL_SECONDS,
  );
}

export async function verifyOtpFromRedis(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  redis: any,
  phone: string,
  inputCode: string,
): Promise<OtpVerificationResult> {
  if (await isPhoneOtpBlocked(redis, phone)) {
    return { status: "blocked" };
  }

  const raw = await redis.get(buildOtpRedisKey(phone));
  const record = parseOtpRedisRecord(raw);

  if (!record) {
    return { status: "expired" };
  }

  if (record.code === inputCode) {
    await redis.del(buildOtpRedisKey(phone));
    return { status: "valid", record };
  }

  const nextAttempts = record.attempts + 1;

  if (nextAttempts >= OTP_MAX_ATTEMPTS) {
    await redis
      .multi()
      .del(buildOtpRedisKey(phone))
      .set(buildOtpBlockKey(phone), "1", "EX", OTP_BLOCK_TTL_SECONDS)
      .exec();

    return { status: "max_attempts_exceeded" };
  }

  const updatedRecord: OtpRedisRecord = {
    code: record.code,
    attempts: nextAttempts,
  };

  const ttl = await redis.ttl(buildOtpRedisKey(phone));
  const expireSeconds = ttl > 0 ? ttl : OTP_TTL_SECONDS;

  await redis.set(
    buildOtpRedisKey(phone),
    JSON.stringify(updatedRecord),
    "EX",
    expireSeconds,
  );

  return {
    status: "invalid",
    remainingAttempts: OTP_MAX_ATTEMPTS - nextAttempts,
  };
}
