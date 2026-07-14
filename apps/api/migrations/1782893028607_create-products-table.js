/**
 * Migration cũ (giữ nguyên timestamp để không mất track trong pgmigrations).
 * Đã sửa: thêm IF NOT EXISTS để idempotent.
 *
 * LƯU Ý: Migration này chỉ tạo cấu trúc tối thiểu ban đầu.
 * Các cột bổ sung (slug, status, category_id, artisan_id, seller_id, is_featured, updated_at)
 * được thêm ở migration 1783998400000_patch-products-table.js
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS products (
      id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      name        VARCHAR(255) NOT NULL,
      price       DECIMAL(12, 0) NOT NULL,   -- VNĐ, không dùng số lẻ
      stock       INTEGER      NOT NULL DEFAULT 0,
      ocop_rating INTEGER      DEFAULT NULL,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS products;`);
};