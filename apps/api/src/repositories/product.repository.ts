import { pool } from '../config/db.js';

export interface CreateProductInput {
  name: string;
  slug?: string;
  price: number;
  stock?: number;
  ocop_rating?: number | null;
  image_url?: string | null;
  description?: string | null;
  category_id?: number | null;
  artisan_id?: number | null;
  is_featured?: boolean;
  status?: string;
}

export const ProductRepository = {
  async findProducts(search?: string, categoryId?: number) {
    const queryText = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.price::float AS price,
        p.stock,
        p.ocop_rating,
        p.image_url,
        p.description,
        p.category_id,
        p.artisan_id,
        p.is_featured,
        p.status,
        p.created_at AS created_at
      FROM products p
      WHERE ($1::text IS NULL OR $1 = '' OR p.name ILIKE '%' || $1 || '%')
        AND ($2::int IS NULL OR $2 = 0 OR p.category_id = $2)
      ORDER BY p.created_at DESC
      LIMIT 50
    `;

    const { rows } = await pool.query(queryText, [search?.trim() || null, categoryId ?? null]);
    return { rows, rowCount: rows.length };
  },

  async findByIdOrSlug(idOrSlug: string | number) {
    const queryText = `
      SELECT
        p.id,
        p.name,
        p.slug,
        p.price::float AS price,
        p.stock,
        p.ocop_rating,
        p.image_url,
        p.description,
        p.category_id,
        p.artisan_id,
        p.is_featured,
        p.status,
        p.created_at
      FROM products p
      WHERE p.id::text = $1::text OR p.slug = $1::text
      LIMIT 1
    `;

    const { rows } = await pool.query(queryText, [String(idOrSlug)]);
    return rows[0] ?? null;
  },

  async createProduct(data: CreateProductInput) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4);
    const queryText = `
      INSERT INTO products (
        name, slug, price, stock, ocop_rating, image_url, description, category_id, artisan_id, is_featured, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const params = [
      data.name,
      slug,
      data.price,
      data.stock ?? 100,
      data.ocop_rating ?? null,
      data.image_url ?? null,
      data.description ?? null,
      data.category_id ?? null,
      data.artisan_id ?? null,
      data.is_featured ?? false,
      data.status ?? 'published',
    ];
    const { rows } = await pool.query(queryText, params);
    return rows[0];
  },

  async updateProduct(id: number | string, data: Partial<CreateProductInput>) {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push(val);
      }
    }

    if (fields.length === 0) return null;
    fields.push(`updated_at = NOW()`);
    values.push(id);

    const queryText = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *
    `;
    const { rows } = await pool.query(queryText, values);
    return rows[0] ?? null;
  },

  async deleteProduct(id: number | string) {
    const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
    return (rows.length > 0);
  }
};

