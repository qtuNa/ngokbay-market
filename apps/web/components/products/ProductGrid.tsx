'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard, Product } from './ProductCard';
import { fetchApi } from '../../src/lib/api';
import { Search, Loader2 } from 'lucide-react';
import { CategoryFilter } from '../pages/products-list/CategoryFilter';

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (debouncedSearch) queryParams.append('search', debouncedSearch);
        if (selectedCategory !== 'all') queryParams.append('category_slug', selectedCategory);
        
        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        const response = await fetchApi<{ success: boolean; data: Product[] }>(`/api/products${query}`);
        if (response.success) {
          setProducts(response.data);
          setError(null);
        }
      } catch (err: any) {
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [debouncedSearch, selectedCategory]);

  return (
    <div>
      {/* Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      {/* Search Bar */}
      <div style={{ marginBottom: 'var(--space-6)', maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            className="input"
            placeholder="Tìm kiếm sản phẩm (vd: mật ong, măng khô...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              paddingLeft: '48px', 
              paddingRight: '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
        </div>
      </div>

      {/* States */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-8)' }}>
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'var(--color-error)', padding: 'var(--space-8)' }}>
          {error}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>
          Không tìm thấy sản phẩm nào phù hợp.
        </div>
      ) : (
        /* Grid */
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: 'var(--space-4)' 
        }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
