import { randomUUID } from "node:crypto";

import type { AuthUser, UserRole } from "../types/auth.js";

/**
 * Tìm hoặc tạo user theo SĐT (định danh chính).
 * TODO: thay bằng Prisma khi @repo/db sẵn sàng:
 *   prisma.user.upsert({ where: { phone }, create: { phone, role: 'BUYER' }, update: {} })
 */
export async function findOrCreateUserByPhone(phone: string): Promise<AuthUser> {
  // Stub: mô phỏng tra cứu DB — id ổn định theo phone trong dev
  const id = randomUUID();

  const user: AuthUser = {
    id,
    phone,
    role: "BUYER" satisfies UserRole,
  };

  return user;
}
