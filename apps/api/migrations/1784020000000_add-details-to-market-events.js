/**
 * Migration: Bổ sung các cột thông tin chi tiết cho phiên chợ
 * - opening_hours: Thời gian mở cửa (VD: "06:00 - 17:00" hoặc "Thứ 7 & Chủ Nhật")
 * - start_date: Thời gian bắt đầu sự kiện (VD: "15/08/2026 06:00")
 * - end_date: Thời gian kết thúc (VD: "17/08/2026 17:00")
 * - description: Mô tả chi tiết chợ phiên
 * - image_url: Hình ảnh đính kèm (URL ảnh banner/poster)
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE market_events
      ADD COLUMN IF NOT EXISTS opening_hours VARCHAR(255),
      ADD COLUMN IF NOT EXISTS start_date VARCHAR(255),
      ADD COLUMN IF NOT EXISTS end_date VARCHAR(255),
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS image_url TEXT;
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    ALTER TABLE market_events
      DROP COLUMN IF EXISTS opening_hours,
      DROP COLUMN IF EXISTS start_date,
      DROP COLUMN IF EXISTS end_date,
      DROP COLUMN IF EXISTS description,
      DROP COLUMN IF EXISTS image_url;
  `);
};
