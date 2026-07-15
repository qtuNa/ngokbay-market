'use client';

import Link from 'next/link';
import MarketMap from '../../maps/market-map';

const sampleMarkets = [
  { id: 1, name: 'Chợ phiên Ba Tơ',    latitude: 14.848, longitude: 108.999, address: 'Ba Tơ, Quảng Ngãi' },
  { id: 2, name: 'Chợ phiên Sơn Hà',   latitude: 14.77,  longitude: 108.91,  address: 'Sơn Hà, Quảng Ngãi' },
  { id: 3, name: 'Chợ phiên Đức Phổ',  latitude: 14.99,  longitude: 108.95,  address: 'Đức Phổ, Quảng Ngãi' },
];

export function HomeMapSection() {
  return (
    <section
      id="market-map"
      style={{
        background: 'linear-gradient(180deg, var(--color-background) 0%, var(--color-earth-light) 100%)',
        padding: 'var(--space-16) 0',
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <div style={{
              color: 'var(--color-forest-mid)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 'var(--space-2)',
            }}>
              Địa điểm
            </div>
            <h2 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
              Bản đồ các phiên chợ
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', maxWidth: 520 }}>
              Tìm các phiên chợ truyền thống gần bạn nhất để trực tiếp trải nghiệm không khí mua bán đậm chất văn hóa bản địa.
            </p>
          </div>
          <Link
            href="/lich-phien"
            id="home-view-schedule"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--color-forest-mid)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--color-forest-mid)',
              whiteSpace: 'nowrap',
              transition: 'background var(--transition-fast), color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'var(--color-forest-mid)';
              el.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = 'transparent';
              el.style.color = 'var(--color-forest-mid)';
            }}
          >
            Xem lịch phiên →
          </Link>
        </div>

        {/* Map Card */}
        <div style={{
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
        }}>
          <MarketMap markets={sampleMarkets} />
        </div>
      </div>
    </section>
  );
}
