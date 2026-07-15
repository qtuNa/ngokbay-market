import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ScheduleHero() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '360px',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #0891b2 100%)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='40' cy='40' r='4'/%3E%3Ccircle cx='0' cy='0' r='4'/%3E%3Ccircle cx='80' cy='0' r='4'/%3E%3Ccircle cx='0' cy='80' r='4'/%3E%3Ccircle cx='80' cy='80' r='4'/%3E%3C/g%3E%3C/svg%3E")`,
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
          📅 Thời gian biểu
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.2,
          marginBottom: 'var(--space-5)',
          maxWidth: '600px',
        }}>
          Lịch phiên chợ<br />Ngok Bay
        </h1>
        <p style={{
          fontSize: '1.0625rem',
          color: 'rgba(255,255,255,0.82)',
          lineHeight: 1.7,
          maxWidth: '520px',
        }}>
          Tìm các phiên chợ truyền thống gần bạn nhất. Mỗi phiên chợ là một lễ hội nhỏ của cộng đồng — không chỉ để mua bán, mà còn để gặp gỡ và giao lưu văn hóa.
        </p>
      </div>
    </section>
  );
}
