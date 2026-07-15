// apps/api/src/repositories/settings.repository.ts
import { pool } from '../config/db.js';

export interface SiteSettingRow {
  key: string;
  value: Record<string, unknown> | unknown[];
  updated_by: string | null;
  updated_at: string;
}

export const SettingsRepository = {
  /**
   * Lấy một setting theo key.
   * Trả về null nếu không tìm thấy.
   */
  async getByKey(key: string): Promise<SiteSettingRow | null> {
    const { rows } = await pool.query<SiteSettingRow>(
      `SELECT key, value, updated_by, updated_at
       FROM site_settings
       WHERE key = $1`,
      [key],
    );
    return rows[0] ?? null;
  },

  /**
   * Lấy nhiều settings theo danh sách key.
   */
  async getByKeys(keys: string[]): Promise<Record<string, unknown>> {
    if (keys.length === 0) return {};
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const { rows } = await pool.query<SiteSettingRow>(
      `SELECT key, value FROM site_settings WHERE key IN (${placeholders})`,
      keys,
    );
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  },

  /**
   * Upsert một setting. Ghi lại ai đã cập nhật.
   */
  async upsert(key: string, value: unknown, updatedBy?: string): Promise<SiteSettingRow> {
    const { rows } = await pool.query<SiteSettingRow>(
      `INSERT INTO site_settings (key, value, updated_by, updated_at)
       VALUES ($1, $2::jsonb, $3, NOW())
       ON CONFLICT (key) DO UPDATE
         SET value       = EXCLUDED.value,
             updated_by  = EXCLUDED.updated_by,
             updated_at  = NOW()
       RETURNING key, value, updated_by, updated_at`,
      [key, JSON.stringify(value), updatedBy ?? null],
    );
    return rows[0]!;
  },
};
