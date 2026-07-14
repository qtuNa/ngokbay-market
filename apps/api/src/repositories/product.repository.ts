// apps/api/src/repositories/product.repository.ts
import { pool } from '../config/db.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const ProductRepository = {
  /**
   * Tìm kiếm sản phẩm đã published.
   * - Lọc theo keyword (ILIKE) và category_id (đã sửa bug filter $2 = 0)
   * - Hỗ trợ pagination (page/limit)
   */
  async findProducts(
    search?: string,
    categoryId?: number,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<{ rows: unknown[]; total: number }> {
    const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
    const offset = (Math.max(1, page) - 1) * safeLimit;

    // Dùng parameterized query — tránh SQL injection kể cả với ILIKE
    const queryText = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price::float AS price,
        p.stock,
        p.category_id,
        p.ocop_rating,
        p.is_featured,
        p.created_at
      FROM products p
      WHERE p.status = 'published'
        AND ($1::text IS NULL OR $1 = '' OR p.name ILIKE '%' || $1 || '%')
        AND ($2::int IS NULL OR p.category_id = $2)
      ORDER BY p.is_featured DESC, p.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const countText = `
      SELECT COUNT(*) AS count
      FROM products p
      WHERE p.status = 'published'
        AND ($1::text IS NULL OR $1 = '' OR p.name ILIKE '%' || $1 || '%')
        AND ($2::int IS NULL OR p.category_id = $2)
    `;

    const params = [search?.trim() || null, categoryId ?? null];

    const [dataRes, countRes] = await Promise.all([
      pool.query(queryText, [...params, safeLimit, offset]),
      pool.query<{ count: string }>(countText, params),
    ]);

    return {
      rows: dataRes.rows,
      total: Number(countRes.rows[0]!.count),
    };
  },

  /**
   * Lấy chi tiết một sản phẩm đã published theo ID.
   */
  async findProductById(id: string): Promise<unknown | null> {
    const queryText = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.description,
        p.price::float AS price,
        p.stock,
        p.category_id,
        p.artisan_id,
        p.seller_id,
        p.ocop_rating,
        p.is_featured,
        p.created_at,
        p.updated_at
      FROM products p
      WHERE p.id = $1
        AND p.status = 'published'
    `;
    const { rows } = await pool.query(queryText, [id]);
    return rows[0] ?? null;
  },
};
