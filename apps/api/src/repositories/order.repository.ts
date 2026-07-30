// apps/api/src/repositories/order.repository.ts
import { pool } from '../config/db.js';

export const OrderRepository = {
  async checkout(userId: string, items: Array<{ product_id: string; quantity: number }>) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let totalAmount = 0;
      const enrichedItems: Array<{ product_id: string; quantity: number; price: number }> = [];

      for (const item of items) {
        const prodResult = await client.query(
          'SELECT price, stock FROM products WHERE id::text = $1',
          [item.product_id]
        );

        if (prodResult.rowCount === 0) {
          throw new Error(`Sản phẩm ${item.product_id} không tồn tại`);
        }

        const prod = prodResult.rows[0];
        const currentStock = Number(prod.stock);
        const price = Number(prod.price);

        if (currentStock < item.quantity) {
          throw new Error(`Sản phẩm ${item.product_id} không đủ hàng (còn ${currentStock})`);
        }

        totalAmount += price * item.quantity;
        enrichedItems.push({ product_id: item.product_id, quantity: item.quantity, price });

        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id::text = $2',
          [item.quantity, item.product_id]
        );
      }

      const orderRes = await client.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id',
        [userId, totalAmount, 'PENDING']
      );
      const orderId = orderRes.rows[0].id;

      for (const item of enrichedItems) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [orderId, item.product_id, item.quantity, item.price]
        );
      }

      await client.query('COMMIT');
      return orderId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async findOrdersByUserId(userId: string) {
    const queryText = `
      SELECT o.id, o.total_amount::float AS total_amount, o.status, o.created_at,
             COUNT(oi.id)::int AS item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    const { rows } = await pool.query(queryText, [userId]);
    return rows;
  },

  async findOrderById(orderId: string, userId?: string) {
    const orderQuery = `
      SELECT o.id, o.user_id, o.total_amount::float AS total_amount, o.status, o.created_at
      FROM orders o
      WHERE o.id = $1 ${userId ? 'AND o.user_id = $2' : ''}
    `;
    const orderRes = await pool.query(orderQuery, userId ? [orderId, userId] : [orderId]);
    const order = orderRes.rows[0];
    if (!order) return null;

    const itemsQuery = `
      SELECT oi.id, oi.product_id, oi.quantity, oi.price::float AS price,
             p.name AS product_name, p.image_url AS product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;
    const itemsRes = await pool.query(itemsQuery, [orderId]);
    return { ...order, items: itemsRes.rows };
  },

  async findAllOrders(status?: string, page = 1, limit = 20) {
    const safeLimit = Math.min(Math.max(1, limit), 50);
    const offset = (Math.max(1, page) - 1) * safeLimit;

    const queryText = `
      SELECT o.id, o.user_id, o.total_amount::float AS total_amount, o.status, o.created_at,
             u.email AS user_email, u.name AS user_name,
             COUNT(oi.id)::int AS item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE ($1::text IS NULL OR $1 = '' OR o.status = $1)
      GROUP BY o.id, u.email, u.name
      ORDER BY o.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const countText = `
      SELECT COUNT(*) AS count
      FROM orders o
      WHERE ($1::text IS NULL OR $1 = '' OR o.status = $1)
    `;
    const params = [status || null];
    const [dataRes, countRes] = await Promise.all([
      pool.query(queryText, [...params, safeLimit, offset]),
      pool.query<{ count: string }>(countText, params),
    ]);

    return {
      rows: dataRes.rows,
      total: Number(countRes.rows[0]?.count || 0),
    };
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { rows } = await pool.query(
      'UPDATE orders SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [orderId, status],
    );
    return rows[0] ?? null;
  }
};