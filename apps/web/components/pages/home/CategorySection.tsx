'use client';

import Link from 'next/link';

interface Category {
  icon: string;
  name: string;
  desc: string;
  href: string;
  color: string;
}

const CATEGORIES: Category[] = [
  {
    icon: '🧺',
    name: 'Giỏ tre đan',
    desc: 'Giỏ tre đan thủ công trao tay, sản phẩm đặc trưng làng Bana',
    href: '/products?category=baskets',
    color: 'linear-gradient(135deg, #78350f, #d97706)',
  },
  {
    icon: '🧵',
    name: 'Vải thổ cẩm',
    desc: 'Vải thổ cẩm rừng, đặc sản của cộng đồng người dân tộc Bana',
    href: '/tho-cam',
    color: 'linear-gradient(135deg, #14532d, #16a34a)',
  },
  {
    icon: '🌿',
    name: 'Nông sản & Đặc sản',
    desc: 'Đặc sản cần drau, nông sản của đồng miền núi & Đặc sản',
    href: '/products?category=farm',
    color: 'linear-gradient(135deg, #92400e, #c2410c)',
  },
  {
    icon: '🥁',
    name: 'Nhạc cụ truyền thống',
    desc: 'Nhạc cụ truyền thống, đặc sắc văn hóa cộng đồng người Bana',
    href: '/van-hoa',
    color: 'linear-gradient(135deg, #1e3a5f, #1d4ed8)',
  },
];

export function CategorySection() {
  return (
    <section style={{
      background: '#fef3c7',
      borderTop: '4px solid #d97706',
      padding: '40px 0',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #f5e6c8',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  height: '100%',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  background: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.75rem',
                  flexShrink: 0,
                }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    color: '#1c1008',
                    marginBottom: '6px',
                    lineHeight: 1.3,
                  }}>
                    {cat.name}
                  </h3>
                  <p style={{
                    fontSize: '0.8125rem',
                    color: '#6b5c3e',
                    lineHeight: 1.6,
                  }}>
                    {cat.desc}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
