/**
 * Migration: Create product_media table
 *
 * Bảng lưu media (ảnh, video) của từng sản phẩm.
 * Được dùng trong CartRepository.getProductDetails() để lấy ảnh đầu tiên:
 *
 *   SELECT s3_key FROM product_media pm
 *   WHERE pm.product_id = p.id AND pm.type = 'image'
 *   ORDER BY pm.display_order ASC LIMIT 1
 *
 * Phải tạo SAU products (FK: product_id → products.id).
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS product_media (
      id            SERIAL      PRIMARY KEY,
      product_id    UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      type          VARCHAR(10) NOT NULL,               -- 'image' | 'video'
      s3_key        TEXT        NOT NULL,               -- Key trên S3/R2 bucket
      thumbnail_key TEXT,                               -- Key ảnh thumbnail (optional)
      display_order INT         NOT NULL DEFAULT 0,     -- Thứ tự hiển thị (ASC)
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

      CONSTRAINT chk_product_media_type CHECK (type IN ('image', 'video'))
    );

    -- Index chính: lookup ảnh theo product (truy vấn phổ biến nhất)
    CREATE INDEX IF NOT EXISTS idx_product_media_product
      ON product_media (product_id, display_order);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_product_media_product;
    DROP TABLE IF EXISTS product_media;
  `);
};
