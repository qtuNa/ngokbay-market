import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
});

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function patch() {
    const client = await pool.connect();
    try {
        console.log("🔧 Thêm cột image_url vào bảng products...");
        await client.query(`
          ALTER TABLE products
            ADD COLUMN IF NOT EXISTS image_url TEXT;
        `);
        console.log("✅ Đã thêm cột image_url thành công!");
    } catch (err) {
        console.error("❌ Lỗi:", err.message);
    } finally {
        client.release();
        await pool.end();
    }
}

patch();
