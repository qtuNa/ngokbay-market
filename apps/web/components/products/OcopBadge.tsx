import React from 'react';
import { Star } from 'lucide-react';

interface OcopBadgeProps {
  rating: number;
}

export function OcopBadge({ rating }: OcopBadgeProps) {
  if (!rating || rating < 1 || rating > 5) return null;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2px',
      backgroundColor: '#fef3c7', // amber-100
      color: '#d97706', // amber-600
      padding: '2px 6px',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      border: '1px solid #fde68a' // amber-200
    }}>
      <span>OCOP</span>
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2px' }}>
        {rating} <Star size={10} fill="currentColor" style={{ marginLeft: '1px' }} />
      </div>
    </div>
  );
}
