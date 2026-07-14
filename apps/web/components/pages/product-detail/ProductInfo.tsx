'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Info } from 'lucide-react';
import { useCartStore } from '../../../src/store/useCartStore';
import { OcopBadge } from '../../products/OcopBadge';
import { Product } from '../../products/ProductCard';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, setIsOpen } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image_url: product.image_url
    });
    setIsOpen(true); // Mở giỏ hàng sau khi thêm
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <OcopBadge rating={product.ocop_rating} />
          {product.stock > 0 && product.stock <= 10 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-error)', fontWeight: 600 }}>
              Chỉ còn {product.stock} sản phẩm
            </span>
          )}
        </div>
        
        <h1 className="text-xl font-bold" style={{ fontSize: '2rem', lineHeight: 1.2, marginBottom: 'var(--space-4)' }}>
          {product.name}
        </h1>
        
        <div className="font-bold text-primary" style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>
          {product.price.toLocaleString('vi-VN')} ₫
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-background)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Info size={18} /> Mô tả sản phẩm
        </h3>
        <p className="text-muted" style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {/* Note: product details from API should have description, but Product interface might not have it yet. 
              We assume product object passed here has full details including description from API. */}
          {(product as any).description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end', marginTop: 'auto' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 600 }}>
            Số lượng
          </label>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={isOutOfStock}
              style={{ padding: 'var(--space-2) var(--space-3)', background: 'none', border: 'none', cursor: isOutOfStock ? 'not-allowed' : 'pointer', color: 'var(--color-text)' }}
            >
              <Minus size={16} />
            </button>
            <span style={{ fontSize: '1rem', padding: '0 var(--space-3)', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              disabled={isOutOfStock || quantity >= product.stock}
              style={{ padding: 'var(--space-2) var(--space-3)', background: 'none', border: 'none', cursor: isOutOfStock || quantity >= product.stock ? 'not-allowed' : 'pointer', color: 'var(--color-text)' }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`btn ${isOutOfStock ? 'btn-secondary' : 'btn-primary'}`}
          style={{ flex: 1, padding: '0.8rem', fontSize: '1rem' }}
        >
          {isOutOfStock ? 'Hết hàng' : (
            <><ShoppingCart size={20} style={{ marginRight: '8px' }} /> Thêm vào giỏ hàng</>
          )}
        </button>
      </div>
    </div>
  );
}
