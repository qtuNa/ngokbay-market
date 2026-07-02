import { pool } from '../config/db.js';

export const MarketRepository = {
  /**
   * Truy vấn tìm kiếm hoặc lấy toàn bộ chợ
   * @param search Từ khóa tìm kiếm (nếu có)
   */
  async findMarkets(search?: string) {
    let queryText = 'SELECT id, name, latitude, longitude, address FROM market_events';
    const queryParams: any[] = [];

    if (search) {
      queryText += ` WHERE name % $1 OR address % $1 OR name ILIKE $2 OR address ILIKE $2`;
      queryParams.push(search, `%${search}%`);
    }

    queryText += ' ORDER BY name ASC';

    const result = await pool.query(queryText, queryParams);
    return result;
  }
};