import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
});

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function seed() {
    const client = await pool.connect();
    try {
        console.log("🚀 Bắt đầu nạp dữ liệu mẫu...");
        await client.query('BEGIN');

        // 1. Thêm Chợ mẫu
        const marketRes = await client.query(`
      INSERT INTO market_events (name, address, latitude, longitude)
      VALUES 
      ('Chợ Phiên Ngok Bay', 'Kon Tum, Việt Nam', 14.35, 107.98),
      ('Chợ Phiên Măng Đen', 'Kon Plông, Kon Tum', 14.60, 108.27)
      RETURNING id;
    `);

        // 2. Thêm Sản phẩm mẫu
        await client.query(`
      INSERT INTO products (name, price, stock, ocop_rating)
      VALUES 
      ('Cà phê Đăk Hà', 150000, 100, 5),
      ('Rượu ghè', 250000, 50, 4),
      ('Sâm Ngọc Linh tươi', 5000000, 10, 5)
    `);

        await client.query('COMMIT');
        console.log("✅ Seed dữ liệu thành công!");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Lỗi khi seed:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();