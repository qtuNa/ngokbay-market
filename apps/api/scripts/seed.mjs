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
      INSERT INTO products (name, slug, price, stock, ocop_rating, image_url, description)
      VALUES 
      ('Cà phê Đăk Hà', 'ca-phe-dak-ha', 150000, 100, 5, 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=600&auto=format&fit=crop', 'Cà phê nguyên chất, thơm ngon đậm đà hương vị Tây Nguyên.'),
      ('Rượu ghè', 'ruou-ghe', 250000, 50, 4, 'https://images.unsplash.com/photo-1574349454133-722a46e10f13?q=80&w=600&auto=format&fit=crop', 'Rượu cần đặc sản của đồng bào Bana, vị cay nồng khó quên.'),
      ('Sâm Ngọc Linh tươi', 'sam-ngoc-linh-tuoi', 5000000, 10, 5, 'https://images.unsplash.com/photo-1610486044703-a4473855a90d?q=80&w=600&auto=format&fit=crop', 'Sâm Ngọc Linh chính gốc, bồi bổ sức khỏe tuyệt vời.'),
      ('Mật ong rừng Măng Đen', 'mat-ong-rung-mang-den', 350000, 30, 4, 'https://images.unsplash.com/photo-1587049352847-4d4b1ed748d0?q=80&w=600&auto=format&fit=crop', 'Mật ong rừng nguyên chất lấy từ hoa rừng tự nhiên.'),
      ('Măng khô Kon Plông', 'mang-kho-kon-plong', 180000, 80, 3, 'https://images.unsplash.com/photo-1563201416-0158ec2b0dfa?q=80&w=600&auto=format&fit=crop', 'Măng le phơi khô tự nhiên, thích hợp nấu canh, xào.')
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