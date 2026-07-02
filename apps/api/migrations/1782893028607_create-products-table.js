export const up = (pgm) => {
    pgm.sql(`
    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      price DECIMAL(18, 2) NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0,
      ocop_rating INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const down = (pgm) => {
    pgm.sql(`DROP TABLE IF EXISTS products;`);
};