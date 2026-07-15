'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { OcopBadge } from './OcopBadge';
import { useCartStore } from '../../src/store/useCartStore';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  ocop_rating: number;
  image_url?: string;
  category_id?: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
    
    // Optional: show a small toast notification here
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Link href={`/products/${product.slug || product.id}`} style={{ display: 'block' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Product Image Placeholder */}
        <div style={{
          aspectRatio: '1/1',
          backgroundColor: 'var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ color: 'var(--color-text-muted)' }}>No image</div>
          )}
          
          {/* OCOP Badge Overlay */}
          <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
            <OcopBadge rating={product.ocop_rating} />
          </div>
          
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'var(--color-error)',
              backdropFilter: 'blur(2px)'
            }}>
              Hết hàng
            </div>
          )}
        </div>

        {/* Product Details */}
        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 className="font-semibold text-text" style={{ 
            marginBottom: 'var(--space-2)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}>
            {product.name}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
            <div className="font-bold text-primary text-lg">
              {product.price.toLocaleString('vi-VN')} ₫
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}`}
              style={{ 
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-full)'
              }}
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
