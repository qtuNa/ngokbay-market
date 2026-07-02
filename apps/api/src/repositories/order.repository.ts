// apps/api/src/repositories/order.repository.ts
import { pool } from '../config/db.js';

export const OrderRepository = {
  async checkout(userId: string, items: any[], totalAmount: number) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN'); // Bắt đầu Transaction

      // 1. Tạo đơn hàng
      const orderRes = await client.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id',
        [userId, totalAmount, 'PENDING']
      );
      const orderId = orderRes.rows[0].id;

      // 2. Insert items và giảm kho
      for (const item of items) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [orderId, item.id, item.quantity, item.price]
        );
        // Kiểm tra tồn kho và giảm
        await client.query(
          'UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1',
          [item.quantity, item.id]
        );
      }

      await client.query('COMMIT'); // Lưu thay đổi
      return orderId;
    } catch (e) {
      await client.query('ROLLBACK'); // Hủy mọi thay đổi nếu lỗi
      throw e;
    } finally {
      client.release();
    }
  }
};