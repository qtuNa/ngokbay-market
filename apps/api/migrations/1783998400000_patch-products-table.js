/**
 * Migration: Patch bảng products — thêm các cột và FK còn thiếu
 *
 * Migration cũ (1782893028607) chỉ tạo 5 cột tối thiểu:
 *   id, name, price, stock, ocop_rating, created_at
 *
 * Code thực tế (product.repository.ts + cart.repository.ts + order.repository.ts) cần:
 *   slug, description, status, category_id, artisan_id, seller_id, is_featured, updated_at
 *
 * Chiến lược: ALTER TABLE (không DROP bảng) để không mất dữ liệu production.
 * Mỗi ADD COLUMN dùng IF NOT EXISTS để idempotent (an toàn chạy lại).
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    -- -------------------------------------------------------
    -- Bổ sung cột còn thiếu vào bảng products
    -- -------------------------------------------------------

    -- slug: URL-friendly identifier duy nhất
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

    -- description: Mô tả chi tiết sản phẩm
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS description TEXT;

    -- image_url: URL ảnh đại diện sản phẩm
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS image_url TEXT;

    -- status: Workflow duyệt sản phẩm
    -- draft → pending_review → published | rejected
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'draft';

    -- rejection_note: Ghi chú khi admin từ chối
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS rejection_note TEXT;

    -- category_id: FK tới categories (tạo ở migration trước)
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS category_id INT REFERENCES categories(id) ON DELETE SET NULL;

    -- artisan_id: FK tới artisans
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS artisan_id INT REFERENCES artisans(id) ON DELETE SET NULL;

    -- seller_id: UUID FK tới users (NULL = admin đăng trực tiếp)
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES users(id) ON DELETE SET NULL;

    -- is_featured: Sản phẩm nổi bật — hiển thị ưu tiên trên trang chủ
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE;

    -- updated_at: Theo dõi lần cập nhật cuối
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

    -- -------------------------------------------------------
    -- Sửa kiểu dữ liệu cho đúng với spec
    -- ocop_rating: SMALLINT (1-5), không phải INTEGER
    -- -------------------------------------------------------
    ALTER TABLE products
      ALTER COLUMN ocop_rating TYPE SMALLINT USING ocop_rating::SMALLINT;

    -- Đảm bảo ocop_rating trong khoảng 1-5 (hoặc NULL)
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_ocop_rating' AND conrelid = 'products'::regclass
      ) THEN
        ALTER TABLE products
          ADD CONSTRAINT chk_ocop_rating
            CHECK (ocop_rating IS NULL OR (ocop_rating >= 1 AND ocop_rating <= 5));
      END IF;
    END $$;

    -- -------------------------------------------------------
    -- Tạo UNIQUE constraint cho slug (nếu chưa có)
    -- -------------------------------------------------------
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'uq_products_slug' AND conrelid = 'products'::regclass
      ) THEN
        -- Cập nhật slug cho các row hiện tại chưa có (tránh lỗi UNIQUE)
        UPDATE products SET slug = 'product-' || id::text WHERE slug IS NULL;
        ALTER TABLE products ALTER COLUMN slug SET NOT NULL;
        ALTER TABLE products ADD CONSTRAINT uq_products_slug UNIQUE (slug);
      END IF;
    END $$;

    -- -------------------------------------------------------
    -- Indexes cho products
    -- -------------------------------------------------------
    CREATE INDEX IF NOT EXISTS idx_products_category  ON products (category_id);
    CREATE INDEX IF NOT EXISTS idx_products_status    ON products (status);
    CREATE INDEX IF NOT EXISTS idx_products_seller    ON products (seller_id);
    CREATE INDEX IF NOT EXISTS idx_products_featured  ON products (is_featured) WHERE is_featured = TRUE;
    CREATE INDEX IF NOT EXISTS idx_products_ocop      ON products (ocop_rating)  WHERE ocop_rating IS NOT NULL;

    -- Full-text search tiếng Việt qua pg_trgm
    CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products
      USING GIN (name gin_trgm_ops);

    -- tsvector index cho search nâng cao (dùng 'simple' không tách morphology tiếng Việt)
    CREATE INDEX IF NOT EXISTS idx_products_fts ON products
      USING GIN (to_tsvector('simple', name || ' ' || COALESCE(description, '')));
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_products_fts;
    DROP INDEX IF EXISTS idx_products_name_trgm;
    DROP INDEX IF EXISTS idx_products_ocop;
    DROP INDEX IF EXISTS idx_products_featured;
    DROP INDEX IF EXISTS idx_products_seller;
    DROP INDEX IF EXISTS idx_products_status;
    DROP INDEX IF EXISTS idx_products_category;

    ALTER TABLE products DROP CONSTRAINT IF EXISTS uq_products_slug;
    ALTER TABLE products DROP CONSTRAINT IF EXISTS chk_ocop_rating;

    ALTER TABLE products DROP COLUMN IF EXISTS updated_at;
    ALTER TABLE products DROP COLUMN IF EXISTS is_featured;
    ALTER TABLE products DROP COLUMN IF EXISTS seller_id;
    ALTER TABLE products DROP COLUMN IF EXISTS artisan_id;
    ALTER TABLE products DROP COLUMN IF EXISTS category_id;
    ALTER TABLE products DROP COLUMN IF EXISTS rejection_note;
    ALTER TABLE products DROP COLUMN IF EXISTS status;
    ALTER TABLE products DROP COLUMN IF EXISTS description;
    ALTER TABLE products DROP COLUMN IF EXISTS slug;
  `);
};
