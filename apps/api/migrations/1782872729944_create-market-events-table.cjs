/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Lệnh chạy khi npm run migrate:up
  pgm.sql(`
    -- Kích hoạt extension hỗ trợ tìm kiếm mờ tiếng Việt
    CREATE EXTENSION IF NOT EXISTS pg_trgm;

    -- Tạo bảng sự kiện phiên chợ
    CREATE TABLE market_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Tạo GIN Index để tối ưu tìm kiếm tốc độ cao
    CREATE INDEX idx_markets_name_trgm ON market_events USING GIN (name gin_trgm_ops);
    CREATE INDEX idx_markets_address_trgm ON market_events USING GIN (address gin_trgm_ops);
  `);
};

exports.down = pgm => {
  // Lệnh chạy khi npm run migrate:down (phải ngược lại với hàm up)
  pgm.sql(`
    DROP INDEX IF EXISTS idx_markets_address_trgm;
    DROP INDEX IF EXISTS idx_markets_name_trgm;
    DROP TABLE IF EXISTS market_events;
    -- Lưu ý: Thường không DROP EXTENSION vì có thể các bảng khác vẫn đang dùng
  `);
};