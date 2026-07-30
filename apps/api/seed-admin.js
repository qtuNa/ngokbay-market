import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
});

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function run() {
  try {
    const res = await pool.query(`
      INSERT INTO users (phone, name, role) 
      VALUES 
        ('0900000000', 'Quản trị viên Ngọk Bay', 'ADMIN'), 
        ('0900000001', 'Biên tập viên Ngọk Bay', 'CONTENT_EDITOR') 
      ON CONFLICT (phone) DO UPDATE 
        SET role = EXCLUDED.role, name = EXCLUDED.name 
      RETURNING phone, name, role;
    `);
    console.log('Successfully seeded admin accounts:', res.rows);
  } catch (err) {
    console.error('Error seeding admin accounts:', err);
  } finally {
    await pool.end();
  }
}

run();
