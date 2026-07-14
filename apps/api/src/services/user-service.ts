// apps/api/src/services/user-service.ts
import { pool } from '../config/db.js';
import type { AuthUser, UserRole } from '../types/auth.js';

/**
 * Tìm hoặc tạo user theo SĐT (định danh chính).
 * Dùng upsert ON CONFLICT để đảm bảo id ổn định qua nhiều lần đăng nhập.
 */
export async function findOrCreateUserByPhone(phone: string): Promise<AuthUser> {
  const result = await pool.query<{ id: string; phone: string; role: UserRole }>(
    `INSERT INTO users (phone, role)
     VALUES ($1, 'BUYER')
     ON CONFLICT (phone) DO UPDATE
       SET updated_at = NOW()
     RETURNING id, phone, role`,
    [phone],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error(`Không thể tạo hoặc tìm user với SĐT: ${phone}`);
  }

  return {
    id: row.id,
    phone: row.phone,
    role: row.role,
  };
}
