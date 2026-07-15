'use client';

import Link from 'next/link';

const NAV_LINKS = [
  { href: '/products',   label: 'Sản phẩm OCOP' },
  { href: '/van-hoa',    label: 'Văn hóa' },
  { href: '/tho-cam',    label: 'Thổ cẩm' },
  { href: '/lich-phien', label: 'Lịch phiên' },
  { href: '/lien-he',    label: 'Liên hệ' },
];

export function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, var(--color-surface) 0%, #0f172a 100%)',
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--space-16) 0 var(--space-8)',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-10)',
          marginBottom: 'var(--space-10)',
        }}>
          {/* Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginBottom: 'var(--space-4)',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-gold) 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.375rem',
              }}>
                N
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.125rem', color: 'white', lineHeight: 1.1 }}>Ngok Bay</div>
                <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>Chợ phiên bản địa</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280 }}>
              Nền tảng kết nối trực tiếp khách hàng với các tiểu thương, nghệ nhân bản địa người Bana tại các phiên chợ truyền thống vùng cao Quảng Ngãi.
            </p>
            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
              {[
                { num: '3+', label: 'Phiên chợ' },
                { num: '50+', label: 'Sản phẩm' },
                { num: '100%', label: 'Bản địa' },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-gold-light)' }}>{s.num}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 style={{ fontWeight: 700, color: 'white', marginBottom: 'var(--space-4)', fontSize: '0.9375rem' }}>Điều hướng</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: '0.875rem',
                      transition: 'color var(--transition-fast)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-gold-light)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)'; }}
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontWeight: 700, color: 'white', marginBottom: 'var(--space-4)', fontSize: '0.9375rem' }}>Liên hệ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { icon: '📍', text: 'Huyện Sơn Hà, Quảng Ngãi' },
                { icon: '📞', text: '0905 123 456' },
                { icon: '✉️', text: 'ngokbay.market@gmail.com' },
              ].map((item) => (
                <div key={item.icon} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8125rem' }}>
            © {new Date().getFullYear()} Chợ Phiên Ngok Bay. Bản quyền được bảo hộ.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
            🏔️ Tự hào mang sản phẩm bản địa đến khắp nơi
          </p>
        </div>
      </div>
    </footer>
  );
}
