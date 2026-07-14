'use client';

import React from 'react';

const categories = [
  { id: 'all', name: 'Tất cả sản phẩm' },
  { id: 'gui-tre-dan', name: 'Gủi - Tre đan' },
  { id: 'vai-tho-cam', name: 'Vải thổ cẩm' },
  { id: 'nong-san-dac-san-ocop', name: 'Nông sản & Đặc sản' },
  { id: 'nhac-cu-truyen-thong', name: 'Nhạc cụ truyền thống' },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className="btn"
          style={{
            backgroundColor: selectedCategory === category.id ? 'var(--color-primary)' : 'var(--color-surface)',
            color: selectedCategory === category.id ? 'white' : 'var(--color-text)',
            border: `1px solid ${selectedCategory === category.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-2) var(--space-4)',
            fontSize: '0.875rem'
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
