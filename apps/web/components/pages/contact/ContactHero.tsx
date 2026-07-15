import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ContactHero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '360px',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f766e 100%)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%23fff'/%3E%3C/svg%3E")`,
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
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 'var(--radius-full)',
          padding: 'var(--space-1) var(--space-4)',
          marginBottom: 'var(--space-4)',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          💬 Kết nối với chúng tôi
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.2,
          marginBottom: 'var(--space-5)',
          maxWidth: '580px',
        }}>
          Liên hệ &<br />Hợp tác
        </h1>
        <p style={{
          fontSize: '1.0625rem',
          color: 'rgba(255,255,255,0.78)',
          lineHeight: 1.7,
          maxWidth: '500px',
        }}>
          Dù bạn là người mua, nhà đầu tư hay muốn đóng góp ý kiến — chúng tôi luôn mở lòng lắng nghe và đồng hành cùng bạn.
        </p>
      </div>
    </section>
  );
}
