import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ThoCamHero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '420px',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #78350f 0%, #92400e 40%, #d97706 100%)',
      overflow: 'hidden',
    }}>
      {/* Geometric pattern overlay (thổ cẩm inspired) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff'%3E%3Cpath d='M0 0l30 30-30 30zm60 0l-30 30 30 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 1, padding: 'var(--space-16) var(--space-4)' }}>
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '0.875rem',
          marginBottom: 'var(--space-6)',
        }}>
          <ArrowLeft size={16} /> Trang chủ
        </Link>
        <div style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 'var(--radius-full)',
          padding: 'var(--space-1) var(--space-4)',
          marginBottom: 'var(--space-4)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          🧵 Nghề dệt truyền thống
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.15,
          marginBottom: 'var(--space-6)',
          maxWidth: '620px',
        }}>
          Thổ cẩm Bana<br />Di sản dệt tay
        </h1>
        <p style={{
          fontSize: '1.0625rem',
          color: 'rgba(255,255,255,0.82)',
          lineHeight: 1.7,
          maxWidth: '540px',
        }}>
          Từng sợi chỉ, từng hoa văn là ngôn ngữ riêng của người Bana — kể về mùa vụ, về tín ngưỡng, về sự gắn kết của cộng đồng qua hàng nghìn năm lịch sử.
        </p>
      </div>
    </section>
  );
}
