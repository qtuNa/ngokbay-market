/**
 * Migration: Create users table + kích hoạt pgcrypto (nếu chưa có)
 *
 * Bảng users là trung tâm của hệ thống:
 *   - Định danh chính bằng SĐT (phone UNIQUE NOT NULL)
 *   - Auth qua OTP Zalo OA — không dùng password
 *   - Roles: BUYER | SELLER | CONTENT_EDITOR | ADMIN
 *
 * Bảng này phải được tạo TRƯỚC products (seller_id FK) và orders (user_id FK).
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    -- Kích hoạt extensions (idempotent — an toàn chạy lại)
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS users (
      id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
      phone       VARCHAR(15) UNIQUE NOT NULL,      -- Định danh chính (auth bằng SĐT)
      name        VARCHAR(100),
      email       VARCHAR(255) UNIQUE,              -- Optional
      role        VARCHAR(20)  NOT NULL DEFAULT 'BUYER',
                  -- BUYER | SELLER | CONTENT_EDITOR | ADMIN
      avatar_url  TEXT,
      is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Index tìm kiếm nhanh theo phone (auth lookup)
    CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);

    -- Index theo role (admin queries)
    CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_users_role;
    DROP INDEX IF EXISTS idx_users_phone;
    DROP TABLE IF EXISTS users;
  `);
};
