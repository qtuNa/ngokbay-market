import dns from 'dns';
import dotenv from 'dotenv';
import { runner } from 'node-pg-migrate';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: true,
});

dns.setDefaultResultOrder('ipv4first');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const direction = process.argv[2] === 'down' ? 'down' : 'up';

try {
  await runner({
    databaseUrl: {
      host: process.env.DB_HOST || '139.59.69.31',
      port: 12102,
      database: 'defaultdb',
      user: 'avnadmin',
      password: process.env.DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    dir: path.join(__dirname, '..', 'migrations'),
    direction,
    migrationsTable: 'pgmigrations',
  });
  console.log(`✅ Migration ${direction} thành công`);
  process.exit(0);
} catch (err) {
  console.error('❌ Migration lỗi:', err);
  process.exit(1);
}