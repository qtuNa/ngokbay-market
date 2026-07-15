import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function CultureHero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '420px',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #7c2d12 100%)',
      overflow: 'hidden',
    }}>
      {/* Pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.07,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0zm20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      <div className="container" style={{ position: 'relative', zIndex: 1, padding: 'var(--space-16) var(--space-4)' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.875rem',
            marginBottom: 'var(--space-6)',
            transition: 'color var(--transition-fast)',
          }}
        >
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
          🌿 Bản sắc dân tộc bản địa
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.15,
          marginBottom: 'var(--space-6)',
          maxWidth: '640px',
        }}>
          Văn hóa vùng cao<br />Quảng Ngãi
        </h1>
        <p style={{
          fontSize: '1.0625rem',
          color: 'rgba(255,255,255,0.8)',
          lineHeight: 1.7,
          maxWidth: '560px',
        }}>
          Hành trình khám phá văn hóa phong phú của người Bana, Hrê — từ lễ hội truyền thống, tín ngưỡng dân gian đến các sản phẩm nông nghiệp gắn liền với đời sống bản làng.
        </p>
      </div>
    </section>
  );
}
