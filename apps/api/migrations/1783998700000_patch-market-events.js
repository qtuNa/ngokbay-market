/**
 * Migration: Patch bảng market_events — thêm cột updated_at + index tối ưu
 *
 * Migration cũ (1782872729944) tạo:
 *   id, name, address, latitude, longitude, created_at
 *   + GIN indexes cho trgm search
 *
 * Code trong market.repository.ts (findMarketById) tính maps_url trực tiếp trong SQL
 * từ latitude/longitude — bảng hiện tại đã đủ cho tính năng này.
 *
 * Bổ sung thêm:
 *   - updated_at: theo dõi cập nhật
 *   - B-tree index trên created_at: ORDER BY name + pagination hiệu quả hơn
 *
 * Không cần thêm status/event_date vì hiện tại market_events là danh sách chợ tĩnh,
 * không phải sự kiện có ngày (phần đó dành cho phase 2 nếu cần).
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    -- Thêm updated_at
    ALTER TABLE market_events
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

    -- Index B-tree cho pagination (ORDER BY name)
    CREATE INDEX IF NOT EXISTS idx_markets_name_btree
      ON market_events (name);

    -- Index B-tree cho ORDER BY created_at DESC
    CREATE INDEX IF NOT EXISTS idx_markets_created_at
      ON market_events (created_at DESC);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_markets_created_at;
    DROP INDEX IF EXISTS idx_markets_name_btree;
    ALTER TABLE market_events DROP COLUMN IF EXISTS updated_at;
  `);
};
