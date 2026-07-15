'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Loader2, ShoppingBag, ArrowRight } from 'lucide-react';
import { fetchApi } from '../../../src/lib/api';
import { useCartStore } from '../../../src/store/useCartStore';
import { OcopBadge } from '../../products/OcopBadge';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  ocop_rating: number;
  image_url?: string;
}

const PRODUCT_PLACEHOLDER_COLORS = [
  '#78350f', '#14532d', '#1e3a5f', '#4c1d95',
  '#7c2d12', '#064e3b', '#713f12', '#1e1b4b',
];

const PRODUCT_EMOJIS = ['🧺', '🍯', '🧵', '🌿', '🥁', '🍃', '🌶️', '🎋'];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCartStore();
  const isOutOfStock = product.stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
    useCartStore.getState().setIsOpen(true);
  };

  const bgColor = PRODUCT_PLACEHOLDER_COLORS[index % PRODUCT_PLACEHOLDER_COLORS.length];
  const emoji = PRODUCT_EMOJIS[index % PRODUCT_EMOJIS.length];

  return (
    <Link href={`/products/${product.slug || product.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #f0e4cc',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        }}
      >
        {/* Image */}
        <div style={{
          position: 'relative',
          aspectRatio: '1/1',
          background: bgColor,
          overflow: 'hidden',
        }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              opacity: 0.7,
            }}>
              {emoji}
            </div>
          )}

          {/* OCOP Badge */}
          {product.ocop_rating > 0 && (
            <div style={{ position: 'absolute', top: 8, left: 8 }}>
              <OcopBadge rating={product.ocop_rating} />
            </div>
          )}

          {/* Out of stock */}
          {isOutOfStock && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#ef4444',
              fontSize: '0.875rem',
              backdropFilter: 'blur(2px)',
            }}>
              Hết hàng
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{
            fontWeight: 600,
            fontSize: '0.875rem',
            color: '#1c1008',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.name}
          </h3>
          <div style={{
            fontWeight: 800,
            fontSize: '1.0625rem',
            color: '#c2410c',
          }}>
            {product.price.toLocaleString('vi-VN')}đ
          </div>
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            style={{
              marginTop: 'auto',
              width: '100%',
              padding: '10px',
              background: isOutOfStock ? '#d1d5db' : '#2d6a2d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.8125rem',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              if (!isOutOfStock) (e.currentTarget as HTMLButtonElement).style.background = '#1a4a1a';
            }}
            onMouseLeave={(e) => {
              if (!isOutOfStock) (e.currentTarget as HTMLButtonElement).style.background = '#2d6a2d';
            }}
          >
            <ShoppingCart size={14} />
            {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>
    </Link>
  );
}

export function HomeFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi<{ success: boolean; data: Product[] }>('/api/products?limit=8')
      .then((res) => { if (res.success) setProducts(res.data); })
      .catch(() => setError('Không thể tải sản phẩm.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ background: '#fef9f0', padding: '56px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          {/* Decorative line */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to right, transparent, #d97706)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#d97706', textTransform: 'uppercase' }}>
              ✦ Sản phẩm ✦
            </span>
            <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to left, transparent, #d97706)' }} />
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            fontWeight: 800,
            color: '#1c1008',
            letterSpacing: '-0.01em',
            marginBottom: '10px',
          }}>
            SẢN PHẨM NỔI BẬT
          </h2>
          <p style={{ color: '#6b5c3e', fontSize: '0.9375rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Những sản phẩm OCOP được người mua tin tưởng nhất — trực tiếp từ tay nghệ nhân bản địa đến bạn
          </p>
        </div>

        {/* Products */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
            <Loader2 size={36} style={{ color: '#c2410c', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#ef4444', padding: '32px' }}>{error}</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#6b5c3e' }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>Chưa có sản phẩm nào. Hãy quay lại sau!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '18px',
          }}>
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* View all */}
        <div style={{ textAlign: 'center', marginTop: '36px' }}>
          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#c2410c',
              color: 'white',
              fontWeight: 700,
              padding: '14px 40px',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              textDecoration: 'none',
              transition: 'background 0.15s, transform 0.15s',
              boxShadow: '0 4px 14px rgba(194, 65, 12, 0.3)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#9a3412';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#c2410c';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            Xem tất cả sản phẩm <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
