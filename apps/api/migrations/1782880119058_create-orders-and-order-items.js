/**
 * Migration cũ (giữ nguyên timestamp để không mất track trong pgmigrations).
 * Đã sửa: thêm IF NOT EXISTS để idempotent.
 *
 * LƯU Ý: FK constraints và indexes được bổ sung ở migration
 * 1783998600000_patch-orders-add-fk-indexes.js (sau khi bảng users đã tồn tại).
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS orders (
      id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id      UUID,                                -- FK sẽ được thêm sau (migration patch)
      total_amount DECIMAL(12, 0) NOT NULL,             -- VNĐ
      status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
      created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id    UUID         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id  UUID         NOT NULL,               -- FK sẽ được thêm sau (migration patch)
      quantity    INT          NOT NULL CHECK (quantity > 0),
      price       DECIMAL(12, 0) NOT NULL              -- Giá tại thời điểm đặt hàng (snapshot)
    );
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
  `);
};
