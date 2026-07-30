/**
 * Migration: Tạo bảng contact_messages
 *
 * Lưu các tin nhắn từ người mua, nhà đầu tư, đối tác hoặc góp ý trên trang Liên hệ.
 * Admin có thể xem, quản lý và cập nhật trạng thái (new -> replied -> closed).
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
      name        VARCHAR(255)  NOT NULL,
      phone       VARCHAR(50),
      email       VARCHAR(255),
      type        VARCHAR(50)   NOT NULL DEFAULT 'buyer',
      message     TEXT          NOT NULL,
      status      VARCHAR(20)   NOT NULL DEFAULT 'new',
      created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_contact_messages_status
      ON contact_messages (status);

    CREATE INDEX IF NOT EXISTS idx_contact_messages_type
      ON contact_messages (type);

    CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
      ON contact_messages (created_at DESC);
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_contact_messages_created_at;
    DROP INDEX IF EXISTS idx_contact_messages_type;
    DROP INDEX IF EXISTS idx_contact_messages_status;
    DROP TABLE IF EXISTS contact_messages;
  `);
};
