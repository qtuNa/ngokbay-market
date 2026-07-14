/**
 * Migration: Patch bảng orders + order_items — bổ sung FK và cột còn thiếu
 *
 * Migration cũ (1782880119058) tạo:
 *   orders:      id, user_id (không có FK!), total_amount, status, created_at
 *   order_items: id, order_id, product_id (không có FK!), quantity, price
 *
 * Cần bổ sung:
 *   orders:
 *     - user_id FK → users.id  (thiếu constraint)
 *     - updated_at
 *     - Indexes: user_id + created_at, status
 *   order_items:
 *     - product_id FK → products.id
 *     - Index: order_id
 *
 * Lưu ý: Nếu trong DB đã có rows cũ với user_id NULL hoặc product_id không tồn tại,
 * việc thêm FK constraint sẽ fail. Migration dùng NOT VALID + VALIDATE để an toàn.
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    -- -------------------------------------------------------
    -- Bổ sung FK user_id → users.id vào bảng orders
    -- NOT VALID: không validate rows cũ ngay, dùng VALIDATE sau
    -- -------------------------------------------------------
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_orders_user' AND conrelid = 'orders'::regclass
      ) THEN
        ALTER TABLE orders
          ADD CONSTRAINT fk_orders_user
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            NOT VALID;
      END IF;
    END $$;

    -- Bổ sung cột updated_at vào orders
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

    -- Indexes cho orders
    CREATE INDEX IF NOT EXISTS idx_orders_user_created
      ON orders (user_id, created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_orders_status
      ON orders (status);

    -- -------------------------------------------------------
    -- Bổ sung FK product_id → products.id vào order_items
    -- -------------------------------------------------------
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_order_items_product' AND conrelid = 'order_items'::regclass
      ) THEN
        ALTER TABLE order_items
          ADD CONSTRAINT fk_order_items_product
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
            NOT VALID;
      END IF;
    END $$;

    -- Index chính cho order_items (JOIN với orders)
    CREATE INDEX IF NOT EXISTS idx_order_items_order
      ON order_items (order_id);

    -- Index tìm kiếm order_items theo product (analytics)
    CREATE INDEX IF NOT EXISTS idx_order_items_product
      ON order_items (product_id);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_order_items_product;
    DROP INDEX IF EXISTS idx_order_items_order;
    ALTER TABLE order_items DROP CONSTRAINT IF EXISTS fk_order_items_product;

    DROP INDEX IF EXISTS idx_orders_status;
    DROP INDEX IF EXISTS idx_orders_user_created;
    ALTER TABLE orders DROP COLUMN IF EXISTS updated_at;
    ALTER TABLE orders DROP CONSTRAINT IF EXISTS fk_orders_user;
  `);
};
