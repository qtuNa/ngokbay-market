import React from 'react';
import { ProductGrid } from '../../components/products/ProductGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản phẩm OCOP | Chợ Phiên Ngok Bay',
  description: 'Khám phá các sản phẩm OCOP và đặc sản địa phương từ các nghệ nhân Bana tại Chợ Phiên Ngok Bay.',
};

export default function ProductsPage() {
  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 className="text-xl font-bold mb-2">Đặc sản địa phương & Sản phẩm OCOP</h1>
        <p className="text-muted">
          Khám phá những món quà từ thiên nhiên và bàn tay tài hoa của nghệ nhân bản địa.
        </p>
      </div>
      
      <ProductGrid />
    </div>
  );
}
