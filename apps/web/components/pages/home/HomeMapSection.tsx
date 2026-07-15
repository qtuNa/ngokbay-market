'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const SCHEDULE_HIGHLIGHTS = [
  { day: 'Thứ 3 & 6', market: 'Chợ phiên Ba Tơ', location: 'Ba Tơ, Quảng Ngãi', note: 'Phiên chợ lớn nhất vùng' },
  { day: 'Thứ 2 & 5', market: 'Chợ phiên Sơn Hà', location: 'Sơn Hà, Quảng Ngãi', note: 'Đặc sản thổ cẩm nhiều nhất' },
  { day: 'Thứ 4 & 7', market: 'Chợ phiên Đức Phổ', location: 'Đức Phổ, Quảng Ngãi', note: 'Nông sản & đặc sản cao nguyên' },
];

export function HomeMapSection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1a0f06 0%, #2c1a0e 60%, #1a3a1a 100%)',
      padding: 'var(--space-16) 0',
    }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '12px' }}>
            <div style={{ height: '1px', width: '60px', background: 'rgba(251,191,36,0.4)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#fbbf24', textTransform: 'uppercase' }}>✦ Lịch phiên ✦</span>
            <div style={{ height: '1px', width: '60px', background: 'rgba(251,191,36,0.4)' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: 'white', marginBottom: '10px' }}>
            CÁC PHIÊN CHỢ TRUYỀN THỐNG
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9375rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
            Mỗi phiên chợ là một lễ hội nhỏ — nơi người Bana mang sản phẩm trao đổi và giao lưu văn hóa
          </p>
        </div>

        {/* Schedule cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
        }}>
          {SCHEDULE_HIGHLIGHTS.map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(251,191,36,0.2)',
              borderRadius: '14px',
              padding: '24px',
              transition: 'background 0.2s, border-color 0.2s',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(251,191,36,0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(251,191,36,0.2)';
              }}
            >
              {/* Day badge */}
              <div style={{
                display: 'inline-block',
                background: 'rgba(194,65,12,0.3)',
                border: '1px solid rgba(194,65,12,0.5)',
                borderRadius: '999px',
                padding: '3px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fbbf24',
                marginBottom: '14px',
                letterSpacing: '0.05em',
              }}>
                📅 {item.day}
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                {item.market}
              </h3>
              <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', marginBottom: '8px' }}>
                📍 {item.location}
              </div>
              <div style={{
                fontSize: '0.8125rem',
                color: '#86efac',
                background: 'rgba(34,197,94,0.1)',
                padding: '4px 10px',
                borderRadius: '6px',
                display: 'inline-block',
              }}>
                ✓ {item.note}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            id="home-view-schedule"
            href="/lich-phien"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#c2410c',
              color: 'white',
              fontWeight: 700,
              padding: '14px 36px',
              borderRadius: '8px',
              fontSize: '0.9375rem',
              textDecoration: 'none',
              transition: 'background 0.15s, transform 0.15s',
              boxShadow: '0 4px 16px rgba(194,65,12,0.35)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#9a3412';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#c2410c';
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
            }}
          >
            Xem đầy đủ lịch phiên <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
