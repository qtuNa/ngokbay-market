// apps/api/src/repositories/market.repository.ts
import { pool } from '../config/db.js';

// Columns thực tế theo migration (1782872729944_create-market-events-table):
//   id, name, address, latitude, longitude, created_at
// (không phải location_text như trong docs spec)

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export const MarketRepository = {
  /**
   * Tìm kiếm hoặc lấy toàn bộ phiên chợ.
   * Dùng pg_trgm similarity (%) cho fuzzy search; fallback ILIKE khi không có extension.
   * Hỗ trợ phân trang.
   */
  async findMarkets(
    search?: string,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<{ rows: unknown[]; total: number }> {
    const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
    const offset = (Math.max(1, page) - 1) * safeLimit;

    let queryText: string;
    let countText: string;
    let params: unknown[];

    if (search?.trim()) {
      // pg_trgm: dùng similarity operator % để fuzzy search tiếng Việt
      // similarity(col, $1) > 0.1 bắt được các lỗi gõ nhỏ
      queryText = `
        SELECT id, name, address, latitude, longitude, created_at,
               GREATEST(
                 similarity(name, $1),
                 similarity(address, $1)
               ) AS _score
        FROM market_events
        WHERE name % $1 OR address % $1 OR name ILIKE $2 OR address ILIKE $2
        ORDER BY _score DESC, name ASC
        LIMIT $3 OFFSET $4
      `;
      countText = `
        SELECT COUNT(*) AS count FROM market_events
        WHERE name % $1 OR address % $1 OR name ILIKE $2 OR address ILIKE $2
      `;
      params = [search.trim(), `%${search.trim()}%`];
    } else {
      queryText = `
        SELECT id, name, address, latitude, longitude, created_at
        FROM market_events
        ORDER BY name ASC
        LIMIT $1 OFFSET $2
      `;
      countText = `SELECT COUNT(*) AS count FROM market_events`;
      params = [];
    }

    const [dataRes, countRes] = await Promise.all([
      pool.query(queryText, search?.trim()
        ? [...params, safeLimit, offset]
        : [safeLimit, offset]),
      pool.query<{ count: string }>(countText, params),
    ]);

    return {
      rows: dataRes.rows,
      total: Number(countRes.rows[0]!.count),
    };
  },

  /**
   * Lấy chi tiết một phiên chợ theo ID, kèm maps_url tính sẵn.
   */
  async findMarketById(id: string): Promise<unknown | null> {
    const { rows } = await pool.query(
      `SELECT
        id, name, address, latitude, longitude, created_at,
        CASE
          WHEN latitude IS NOT NULL AND longitude IS NOT NULL
          THEN 'https://www.google.com/maps/dir/?api=1&destination=' || latitude || ',' || longitude || '&travelmode=driving'
          ELSE NULL
        END AS maps_url
       FROM market_events
       WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  },

  /**
   * Tạo mới một sự kiện phiên chợ.
   */
  async createMarketEvent(event: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  }): Promise<unknown> {
    const { rows } = await pool.query(
      `INSERT INTO market_events (name, address, latitude, longitude)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        event.name,
        event.address,
        event.latitude ?? null,
        event.longitude ?? null,
      ],
    );
    return rows[0];
  },
};