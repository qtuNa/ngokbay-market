import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductGrid } from '../../products/ProductGrid';

export function FeaturedProducts() {
  return (
    <section className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
        <div>
          <h2 className="text-xl font-bold mb-2">Đặc sản nổi bật</h2>
          <p className="text-muted">Những sản phẩm được yêu thích nhất từ bản làng</p>
        </div>
        <Link href="/products" className="text-primary font-semibold flex items-center gap-1" style={{ fontSize: '0.875rem' }}>
          Xem tất cả <ArrowRight size={16} />
        </Link>
      </div>
      
      {/* Hiện tại ProductGrid đang dùng chung, sau này có thể thêm filter `?featured=true` nếu backend hỗ trợ */}
      <ProductGrid />
    </section>
  );
}
