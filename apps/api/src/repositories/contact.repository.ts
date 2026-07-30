import { pool } from '../config/db.js';

export interface CreateContactInput {
  name: string;
  phone?: string;
  email?: string;
  type?: string;
  message: string;
}

export const ContactRepository = {
  async createMessage(data: CreateContactInput) {
    const queryText = `
      INSERT INTO contact_messages (name, phone, email, type, message, status)
      VALUES ($1, $2, $3, $4, $5, 'new')
      RETURNING *
    `;
    const params = [
      data.name.trim(),
      data.phone?.trim() || null,
      data.email?.trim() || null,
      data.type || 'buyer',
      data.message.trim(),
    ];
    const { rows } = await pool.query(queryText, params);
    return rows[0];
  },

  async findMessages(status?: string, type?: string, page = 1, limit = 20) {
    const safeLimit = Math.min(Math.max(1, limit), 50);
    const offset = (Math.max(1, page) - 1) * safeLimit;

    const queryText = `
      SELECT *
      FROM contact_messages
      WHERE ($1::text IS NULL OR $1 = '' OR status = $1)
        AND ($2::text IS NULL OR $2 = '' OR type = $2)
      ORDER BY created_at DESC
      LIMIT $3 OFFSET $4
    `;
    const countText = `
      SELECT COUNT(*) AS count
      FROM contact_messages
      WHERE ($1::text IS NULL OR $1 = '' OR status = $1)
        AND ($2::text IS NULL OR $2 = '' OR type = $2)
    `;
    const params = [status || null, type || null];

    const [dataRes, countRes] = await Promise.all([
      pool.query(queryText, [...params, safeLimit, offset]),
      pool.query<{ count: string }>(countText, params),
    ]);

    return {
      rows: dataRes.rows,
      total: Number(countRes.rows[0]?.count || 0),
    };
  },

  async findById(id: string) {
    const { rows } = await pool.query('SELECT * FROM contact_messages WHERE id = $1', [id]);
    return rows[0] ?? null;
  },

  async updateStatus(id: string, status: string) {
    const queryText = `
      UPDATE contact_messages
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await pool.query(queryText, [id, status]);
    return rows[0] ?? null;
  },

  async deleteMessage(id: string) {
    const { rows } = await pool.query('DELETE FROM contact_messages WHERE id = $1 RETURNING id', [id]);
    return rows.length > 0;
  }
};
