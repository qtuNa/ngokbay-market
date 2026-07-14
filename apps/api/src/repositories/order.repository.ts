// apps/api/src/repositories/order.repository.ts
import { pool } from '../config/db.js';

// Custom errors để route có thể phân biệt loại lỗi
export class ProductNotFoundError extends Error {
  constructor(public readonly productId: string) {
    super(`Sản phẩm ${productId} không tồn tại`);
    this.name = 'ProductNotFoundError';
  }
}

export class InsufficientStockError extends Error {
  constructor(
    public readonly productId: string,
    public readonly available: number,
    public readonly requested: number,
  ) {
    super(`Sản phẩm ${productId} không đủ hàng (còn ${available}, yêu cầu ${requested})`);
    this.name = 'InsufficientStockError';
  }
}

export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface OrderItemWithPrice extends OrderItem {
  price: number;
}

export const OrderRepository = {
  /**
   * Fetch giá thực từ DB theo danh sách product_id.
   * Trả về map product_id → price để route có thể tính totalAmount.
   */
  async fetchProductPrices(
    productIds: string[],
  ): Promise<Map<string, number>> {
    const { rows } = await pool.query<{ id: string; price: string }>(
      `SELECT id, price::float AS price FROM products WHERE id = ANY($1::uuid[]) AND status = 'published'`,
      [productIds],
    );
    const map = new Map<string, number>();
    for (const row of rows) {
      map.set(row.id, Number(row.price));
    }
    return map;
  },

  /**
   * Tạo đơn hàng trong một DB transaction:
   * 1. INSERT order
   * 2. Với mỗi item: SELECT ... FOR UPDATE (lock row), kiểm tra stock, INSERT order_item, UPDATE stock
   * 3. COMMIT hoặc ROLLBACK
   *
   * Giá được truyền vào từ items đã enrich bởi fetchProductPrices — không từ client.
   */
  async checkout(
    userId: string,
    items: OrderItemWithPrice[],
    totalAmount: number,
  ): Promise<string> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderRes = await client.query<{ id: string }>(
        `INSERT INTO orders (user_id, total_amount, status)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [userId, totalAmount, 'PENDING'],
      );
      const orderId = orderRes.rows[0]!.id;

      for (const item of items) {
        // Lock row để tránh race condition (oversell)
        const stockResult = await client.query<{ stock: number }>(
          `SELECT stock FROM products WHERE id = $1 FOR UPDATE`,
          [item.product_id],
        );

        if (stockResult.rowCount === 0) {
          throw new ProductNotFoundError(item.product_id);
        }

        const currentStock = Number(stockResult.rows[0]!.stock);
        if (currentStock < item.quantity) {
          throw new InsufficientStockError(item.product_id, currentStock, item.quantity);
        }

        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.product_id, item.quantity, item.price],
        );

        // Atomic decrement — không thể < 0 nhờ lock ở trên
        await client.query(
          `UPDATE products SET stock = stock - $1 WHERE id = $2`,
          [item.quantity, item.product_id],
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

  async findOrdersByUserId(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ rows: unknown[]; total: number }> {
    const offset = (page - 1) * limit;

    const [dataRes, countRes] = await Promise.all([
      pool.query(
        `SELECT id, total_amount::float AS total_amount, status, created_at
         FROM orders
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset],
      ),
      pool.query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM orders WHERE user_id = $1`,
        [userId],
      ),
    ]);

    return {
      rows: dataRes.rows,
      total: Number(countRes.rows[0]!.count),
    };
  },

  async findOrderById(orderId: string, userId: string) {
    const orderQuery = `
      SELECT id, total_amount::float AS total_amount, status, created_at
      FROM orders
      WHERE id = $1 AND user_id = $2
    `;
    const itemsQuery = `
      SELECT oi.id, oi.product_id, oi.quantity, oi.price::float AS price, p.name AS product_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `;
    const orderRes = await pool.query(orderQuery, [orderId, userId]);
    if (orderRes.rows.length === 0) return null;

    const itemsRes = await pool.query(itemsQuery, [orderId]);
    return {
      ...orderRes.rows[0],
      items: itemsRes.rows,
    };
  },
};