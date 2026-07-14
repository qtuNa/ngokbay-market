/**
 * Migration: Create categories + artisans tables
 *
 * Hai bảng này là lookup/reference tables, không phụ thuộc vào bảng nào.
 * Phải tạo TRƯỚC products vì products có FK tới cả hai.
 *
 * categories: Phân loại sản phẩm bản địa (gủi tre đan, vải thổ cẩm, nông sản OCOP, nhạc cụ)
 * artisans:   Thông tin nghệ nhân/hộ sản xuất bản địa người Bana
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    -- -------------------------------------------------------
    -- CATEGORIES: Danh mục sản phẩm (hỗ trợ nested/parent)
    -- -------------------------------------------------------
    CREATE TABLE IF NOT EXISTS categories (
      id          SERIAL      PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      slug        VARCHAR(100) NOT NULL,
      icon_url    TEXT,
      parent_id   INT         REFERENCES categories(id) ON DELETE SET NULL,
      sort_order  INT         NOT NULL DEFAULT 0,
      CONSTRAINT uq_categories_slug UNIQUE (slug)
    );

    CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories (parent_id);
    CREATE INDEX IF NOT EXISTS idx_categories_sort   ON categories (sort_order);

    -- Seed 4 danh mục gốc theo spec
    INSERT INTO categories (name, slug, sort_order) VALUES
      ('Gủi - Tre đan',             'gui-tre-dan',             1),
      ('Vải thổ cẩm',               'vai-tho-cam',             2),
      ('Nông sản & Đặc sản OCOP',   'nong-san-dac-san-ocop',   3),
      ('Nhạc cụ truyền thống',       'nhac-cu-truyen-thong',    4)
    ON CONFLICT (slug) DO NOTHING;

    -- -------------------------------------------------------
    -- ARTISANS: Nghệ nhân / hộ sản xuất bản địa
    -- -------------------------------------------------------
    CREATE TABLE IF NOT EXISTS artisans (
      id          SERIAL      PRIMARY KEY,
      name        VARCHAR(100) NOT NULL,
      bio         TEXT,
      photo_url   TEXT,
      village     VARCHAR(100),                     -- Làng/thôn bản địa
      specialty   VARCHAR(100)                      -- Nghề đặc trưng
    );

    CREATE INDEX IF NOT EXISTS idx_artisans_name ON artisans USING GIN (name gin_trgm_ops);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_artisans_name;
    DROP TABLE IF EXISTS artisans;

    DROP INDEX IF EXISTS idx_categories_sort;
    DROP INDEX IF EXISTS idx_categories_parent;
    DROP TABLE IF EXISTS categories;
  `);
};
