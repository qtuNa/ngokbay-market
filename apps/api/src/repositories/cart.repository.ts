import { pool } from '../config/db.js';

export const CartRepository = {
  /**
   * Truy vấn thông tin chi tiết các sản phẩm theo danh sách ID
   */
  async getProductDetails(productIds: string[]) {
    const queryText = `
      SELECT 
        p.id, 
        p.name, 
        p.price::float as price, 
        p.ocop_rating,
        (
          SELECT s3_key 
          FROM product_media pm 
          WHERE pm.product_id = p.id AND pm.type = 'image' 
          ORDER BY pm.display_order ASC 
          LIMIT 1
        ) as image_url,
        CASE 
          WHEN p.seller_id IS NOT NULL THEN json_build_object('id', u.id, 'name', u.name, 'phone', u.phone)
          ELSE NULL
        END as merchant,
        CASE 
          WHEN p.artisan_id IS NOT NULL THEN json_build_object('id', a.id, 'name', a.name, 'village', a.village)
          ELSE NULL
        END as artisan
      FROM products p
      LEFT JOIN users u ON p.seller_id = u.id
      LEFT JOIN artisans a ON p.artisan_id = a.id
      WHERE p.id = ANY($1::uuid[])
    `;
    
    // Sử dụng pool.query trực tiếp: tự động lấy/trả connection từ pool
    const { rows } = await pool.query(queryText, [productIds]);
    return rows;
  }
};