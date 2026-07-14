import React from 'react';

interface ProductGalleryProps {
  images: { id: string; url: string; isPrimary?: boolean }[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Currently, we just show the first image or a placeholder
  const primaryImage = images.find(img => img.isPrimary) || images[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Main Image */}
      <div style={{ 
        width: '100%', 
        aspectRatio: '1/1', 
        backgroundColor: 'var(--color-border)', 
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {primaryImage ? (
          <img 
            src={primaryImage.url} 
            alt={productName} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : (
          <span style={{ color: 'var(--color-text-muted)' }}>Chưa có hình ảnh</span>
        )}
      </div>

      {/* Thumbnails (if multiple images) */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
          {images.map(img => (
            <div 
              key={img.id}
              style={{ 
                width: '80px', 
                height: '80px', 
                flexShrink: 0,
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: img.id === primaryImage?.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                cursor: 'pointer'
              }}
            >
              <img 
                src={img.url} 
                alt={`${productName} thumbnail`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
