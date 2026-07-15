'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',           label: 'Trang chủ' },
  { href: '/products',   label: 'Sản phẩm' },
  { href: '/van-hoa',    label: 'Văn hóa' },
  { href: '/lien-he',    label: 'Liên hệ' },
];

export function Footer() {
  return (
    <footer style={{
      background: '#1a0f06',
      borderTop: '3px solid #d97706',
      color: 'rgba(255,255,255,0.75)',
    }}>
      <div className="container" style={{ padding: '48px 16px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '36px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: '44px', height: '44px',
                background: 'linear-gradient(135deg, #c2410c, #d97706)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
              }}>🏪</div>
              <div>
                <div style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.15em', color: '#d97706', textTransform: 'uppercase' }}>CHỢ PHIÊN</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>NGỌK BAY</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', maxWidth: 250 }}>
              Nền tảng kết nối trực tiếp khách hàng với nghệ nhân bản địa người Bana tại vùng cao Quảng Ngãi.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Youtube, href: '#', label: 'Youtube' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} style={{
                  width: 36, height: 36,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  transition: 'background 0.15s, color 0.15s',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(217,119,6,0.3)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#fbbf24';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ fontWeight: 700, color: 'white', fontSize: '0.9375rem', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 10 }}>
              CONTACT INFO
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { Icon: MapPin, text: 'Làng Ngọk Bay, Kon Tum' },
                { Icon: Phone, text: 'Hotline: 0987 634 331' },
                { Icon: Mail, text: 'Email: shop@ngokbay.vn' },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <Icon size={15} style={{ color: '#d97706', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 style={{ fontWeight: 700, color: 'white', fontSize: '0.9375rem', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 10 }}>
              SOCIAL LINKS
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{
                    fontSize: '0.8125rem',
                    color: 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'color 0.15s',
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#fbbf24'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; }}
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mini map placeholder */}
          <div>
            <h3 style={{ fontWeight: 700, color: 'white', fontSize: '0.9375rem', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 10 }}>
              VỊ TRÍ
            </h3>
            <Link href="/lich-phien">
              <div style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 8,
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(217,119,6,0.12)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; }}
              >
                <span style={{ fontSize: '2rem' }}>🗺️</span>
                <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>Xem bản đồ phiên chợ</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Chợ Phiên Ngọk Bay. Bản quyền được bảo hộ.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
            🏔️ Tự hào mang sản phẩm bản địa đến khắp nơi
          </p>
        </div>
      </div>
    </footer>
  );
}
