'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Loader2, ArrowRight } from 'lucide-react';
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
  'linear-gradient(135deg, #2d5a27, #1a3a1a)',
  'linear-gradient(135deg, #4a2c0d, #8b5e3c)',
  'linear-gradient(135deg, #1a3a1a, #2d5a27)',
  'linear-gradient(135deg, #6b4629, #4a2c0d)',
  'linear-gradient(135deg, #8b5e3c, #c9a96e)',
  'linear-gradient(135deg, #2d5a27, #4a7c40)',
  'linear-gradient(135deg, #3a1c0d, #6b4629)',
  'linear-gradient(135deg, #1a3a1a, #4a7c40)',
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
  // Stagger: 2nd and 4th cards get offset top like MAISON reference
  const isOffset = index === 1 || index === 3;

  return (
    <div style={{ marginTop: isOffset ? '3rem' : '0' }}>
      <Link href={`/products/${product.slug || product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ cursor: 'pointer' }}>
          {/* Image */}
          <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ aspectRatio: '5/6', background: bgColor, overflow: 'hidden' }}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.7s ease' }}
                  onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', opacity: 0.65 }}>
                  {emoji}
                </div>
              )}
            </div>

            {/* OCOP Badge */}
            {product.ocop_rating > 0 && (
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <OcopBadge rating={product.ocop_rating} />
              </div>
            )}

            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(253, 246, 236, 0.75)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: '#b91c1c', fontSize: '0.875rem',
                backdropFilter: 'blur(2px)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                Hết hàng
              </div>
            )}

            {/* Add to cart button — appears on hover */}
            <div style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              right: '1rem',
              display: 'flex',
              gap: '0.5rem',
              transform: 'translateY(8px)',
              opacity: 0,
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            }}
              className="product-actions"
            >
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: isOutOfStock ? 'rgba(220,220,220,0.9)' : 'rgba(253,246,236,0.95)',
                  color: isOutOfStock ? '#999' : '#1c1208',
                  border: 'none',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  backdropFilter: 'blur(4px)',
                  fontFamily: 'inherit',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { if (!isOutOfStock) (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
                onMouseLeave={(e) => { if (!isOutOfStock) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(253,246,236,0.95)'; }}
              >
                <ShoppingBag size={13} />
                {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8b5e3c', marginBottom: '0.3rem' }}>
              Ngọk Bay OCOP
            </p>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1875rem',
              fontWeight: 400,
              color: '#1c1208',
              marginBottom: '0.25rem',
              lineHeight: 1.3,
              transition: 'color 0.3s',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLHeadingElement).style.color = '#2d5a27'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLHeadingElement).style.color = '#1c1208'; }}
            >
              {product.name}
            </h3>
            <p style={{ fontWeight: 600, fontSize: '1.0625rem', color: '#4a2c0d' }}>
              {product.price.toLocaleString('vi-VN')}đ
            </p>
          </div>
        </div>
      </Link>

      <style>{`
        .product-card-wrap:hover .product-actions {
          transform: translateY(0) !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

// Wrapper with hover state
function ProductCardWrapper({ product, index }: { product: Product; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isOffset = index === 1 || index === 3;
  const { addItem } = useCartStore();
  const isOutOfStock = product.stock <= 0;
  const bgColor = PRODUCT_PLACEHOLDER_COLORS[index % PRODUCT_PLACEHOLDER_COLORS.length];
  const emoji = PRODUCT_EMOJIS[index % PRODUCT_EMOJIS.length];

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({ product_id: product.id, name: product.name, price: product.price, quantity: 1, image_url: product.image_url });
    useCartStore.getState().setIsOpen(true);
  };

  return (
    <div
      style={{ marginTop: isOffset ? '3rem' : '0' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.slug || product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div>
          <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ aspectRatio: '5/6', background: bgColor, overflow: 'hidden' }}>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transform: hovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', opacity: 0.65 }}>
                  {emoji}
                </div>
              )}
            </div>

            {product.ocop_rating > 0 && (
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <OcopBadge rating={product.ocop_rating} />
              </div>
            )}

            {isOutOfStock && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(253,246,236,0.75)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, color: '#b91c1c', fontSize: '0.875rem',
                backdropFilter: 'blur(2px)', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>Hết hàng</div>
            )}

            {/* Hover actions */}
            <div style={{
              position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem',
              display: 'flex', gap: '0.5rem',
              transform: hovered ? 'translateY(0)' : 'translateY(10px)',
              opacity: hovered ? 1 : 0,
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            }}>
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                style={{
                  flex: 1, padding: '0.75rem 1rem',
                  background: isOutOfStock ? 'rgba(220,220,220,0.9)' : 'rgba(253,246,236,0.95)',
                  color: isOutOfStock ? '#999' : '#1c1208',
                  border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '0.4rem',
                  backdropFilter: 'blur(4px)', fontFamily: 'inherit',
                }}
              >
                <ShoppingBag size={13} />
                {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
              </button>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8b5e3c', marginBottom: '0.3rem' }}>Ngọk Bay OCOP</p>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1875rem', fontWeight: 400,
              color: hovered ? '#2d5a27' : '#1c1208',
              marginBottom: '0.25rem', lineHeight: 1.3,
              transition: 'color 0.3s',
            }}>
              {product.name}
            </h3>
            <p style={{ fontWeight: 600, fontSize: '1.0625rem', color: '#4a2c0d' }}>
              {product.price.toLocaleString('vi-VN')}đ
            </p>
          </div>
        </div>
      </Link>
    </div>
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
    <section style={{ background: 'white', padding: '6rem 0' }}>
      <div className="container-wide">
        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '4rem',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}>
            <div>
              <p style={{
                fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.3em',
                textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.75rem',
              }}>Tuyển Chọn</p>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400, lineHeight: 1.1, color: '#1c1208',
              }}>
                Đặc Sản
                <em style={{ fontStyle: 'italic', color: '#2d5a27' }}> Nổi Bật</em>
              </h2>
            </div>
            <p style={{ color: '#6b5439', fontSize: '1rem', lineHeight: 1.75, maxWidth: '400px', textAlign: 'right' }}>
              Mỗi sản phẩm là tinh hoa của đất trời và bàn tay người nghệ nhân bản địa vùng Ngọk Bay.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <Loader2 size={40} style={{ color: '#c9a96e', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#b91c1c', padding: '3rem' }}>{error}</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#6b5439' }}>
            <ShoppingBag size={56} style={{ margin: '0 auto 1rem', opacity: 0.25 }} />
            <p>Chưa có sản phẩm nào. Hãy quay lại sau!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem 2rem',
          }}
            className="products-grid"
          >
            {products.slice(0, 8).map((product, i) => (
              <ProductCardWrapper key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        {/* View all */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/products" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: '1px solid #1c1208',
            color: '#1c1208',
            fontWeight: 600,
            fontSize: '0.8125rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            padding: '1rem 2.5rem',
            textDecoration: 'none',
            transition: 'background 0.3s, color 0.3s',
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#1c1208';
              (e.currentTarget as HTMLAnchorElement).style.color = '#fdf6ec';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = '#1c1208';
            }}
          >
            Xem toàn bộ bộ sưu tập <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .products-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}
