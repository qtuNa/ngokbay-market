/**
 * Migration: Tạo bảng site_settings
 *
 * Lưu cấu hình trang web mà admin có thể chỉnh sửa trực tiếp trên UI.
 * Dùng kiểu key-value JSON (JSONB) để linh hoạt mở rộng mà không cần migration mới.
 *
 * Các key hiện tại:
 *   - hero_banner: { image_url, title, description, cta_primary, cta_secondary }
 *   - culture_highlights: [{ id, title, description, image_url, link }]
 *   - site_meta: { contact_email, contact_phone, address, facebook_url, zalo_url }
 */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key         VARCHAR(100)  PRIMARY KEY,
      value       JSONB         NOT NULL DEFAULT '{}',
      updated_by  UUID          REFERENCES users(id) ON DELETE SET NULL,
      updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
    );

    -- Index trên updated_at để audit log
    CREATE INDEX IF NOT EXISTS idx_site_settings_updated_at
      ON site_settings (updated_at DESC);

    -- Seed dữ liệu mặc định cho hero banner
    INSERT INTO site_settings (key, value) VALUES
    (
      'hero_banner',
      '{
        "title": "Mang Bản Sắc Vùng Cao Đến Tận Tay Bạn",
        "description": "Nền tảng kết nối trực tiếp với các tiểu thương, nghệ nhân bản địa người Bana. Khám phá nông sản OCOP, thổ cẩm và thủ công mỹ nghệ từ vùng cao Quảng Ngãi.",
        "image_url": null,
        "cta_primary_text": "Mua sắm ngay",
        "cta_primary_link": "/products",
        "cta_secondary_text": "Khám phá văn hóa",
        "cta_secondary_link": "/van-hoa"
      }'::jsonb
    ),
    (
      'culture_highlights',
      '[
        {
          "id": "ocop",
          "title": "Nông sản OCOP",
          "description": "Mật ong rừng, măng khô, tiêu rừng — những đặc sản được chứng nhận OCOP 3–4 sao từ vùng núi Quảng Ngãi, thu hoạch tự nhiên không hóa chất.",
          "image_url": null,
          "link": "/products"
        },
        {
          "id": "tho-cam",
          "title": "Thổ cẩm Bana",
          "description": "Từng sợi vải dệt tay mang theo tâm huyết của nghệ nhân người Bana. Hoa văn hình học truyền thống, màu sắc từ chất liệu thiên nhiên.",
          "image_url": null,
          "link": "/tho-cam"
        },
        {
          "id": "artisan",
          "title": "Nghệ nhân bản địa",
          "description": "Gặp gỡ những bàn tay tạo ra điều kỳ diệu — các nghệ nhân người Bana, Hrê gìn giữ nghề truyền thống qua nhiều thế hệ tại vùng cao Sơn Hà, Ba Tơ.",
          "image_url": null,
          "link": "/van-hoa"
        }
      ]'::jsonb
    ),
    (
      'site_meta',
      '{
        "contact_email": "ngokbay.market@gmail.com",
        "contact_phone": "0905 123 456",
        "address": "Huyện Sơn Hà, Quảng Ngãi, Việt Nam",
        "facebook_url": null,
        "zalo_url": null,
        "description": "Chợ Phiên Ngok Bay — Nền tảng kết nối trực tiếp khách hàng với các tiểu thương, nghệ nhân bản địa người Bana tại các phiên chợ truyền thống vùng cao Quảng Ngãi."
      }'::jsonb
    )
    ON CONFLICT (key) DO NOTHING;
  `);
};

export const down = (pgm) => {
  pgm.sql(`
    DROP INDEX IF EXISTS idx_site_settings_updated_at;
    DROP TABLE IF EXISTS site_settings;
  `);
};
