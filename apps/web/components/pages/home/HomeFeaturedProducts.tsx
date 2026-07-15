'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard, Product } from '../../products/ProductCard';
import { fetchApi } from '../../../src/lib/api';
import { ArrowRight, Loader2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

/**
 * FeaturedProductsGrid — hiển thị 8 sản phẩm đầu tiên dạng grid.
 * Dùng cho trang chủ, không có search/filter (khác ProductGrid ở trang /products).
 */
export function FeaturedProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchApi<{ success: boolean; data: Product[] }>(
          '/api/products?limit=8',
        );
        if (res.success) {
          setProducts(res.data);
        }
      } catch {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-12)' }}>
        <Loader2 size={36} style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-error)', padding: 'var(--space-8)' }}>
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-12)' }}>
        <ShoppingBag size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
        <p>Chưa có sản phẩm nào. Hãy quay lại sau!</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
      gap: 'var(--space-5)',
    }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/**
 * HomeFeaturedProducts — section đặt trên trang chủ,
 * gồm header + grid sản phẩm nổi bật + nút xem tất cả.
 */
export function HomeFeaturedProducts() {
  return (
    <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-background)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{
              display: 'inline-block',
              color: 'var(--color-primary)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-2)',
            }}>
              Đặc sản nổi bật
            </div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Được yêu thích nhất
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontSize: '0.9375rem' }}>
              Những sản phẩm được người mua tin tưởng lựa chọn nhiều nhất từ bản làng
            </p>
          </div>
          <Link
            href="/products"
            id="home-view-all-products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--color-primary)',
              transition: 'background var(--transition-fast), color var(--transition-fast)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'var(--color-primary)';
              el.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'transparent';
              el.style.color = 'var(--color-primary)';
            }}
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>

        {/* Product Grid */}
        <FeaturedProductsGrid />
      </div>
    </section>
  );
}
