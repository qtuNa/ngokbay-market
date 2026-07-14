/* eslint-disable camelcase */

/**
 * Migration cũ (giữ nguyên timestamp để không mất track trong pgmigrations).
 * Đã sửa: thêm IF NOT EXISTS để idempotent.
 *
 * LƯU Ý: cột updated_at được thêm ở migration
 * 1783998700000_patch-market-events.js
 */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    -- Kích hoạt extension hỗ trợ tìm kiếm mờ tiếng Việt
    CREATE EXTENSION IF NOT EXISTS pg_trgm;

    -- Tạo bảng phiên chợ
    CREATE TABLE IF NOT EXISTS market_events (
      id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
      name        VARCHAR(255)  NOT NULL,
      address     TEXT          NOT NULL,
      latitude    DECIMAL(10, 8),
      longitude   DECIMAL(11, 8),
      created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    -- GIN Indexes cho tìm kiếm fuzzy tiếng Việt (pg_trgm)
    CREATE INDEX IF NOT EXISTS idx_markets_name_trgm
      ON market_events USING GIN (name gin_trgm_ops);

    CREATE INDEX IF NOT EXISTS idx_markets_address_trgm
      ON market_events USING GIN (address gin_trgm_ops);
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_markets_address_trgm;
    DROP INDEX IF EXISTS idx_markets_name_trgm;
    DROP TABLE IF EXISTS market_events;
  `);
};