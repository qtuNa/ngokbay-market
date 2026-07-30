'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Thay CategorySection bằng Heritage Section — Giới thiệu Ngọk Bay
// Tương đương "Our Heritage" trong reference luxury site

export function CategorySection() {
  return (
    <section style={{
      background: '#1a3a1a',
      padding: '6rem 0',
      overflow: 'hidden',
    }}>
      <div className="container-wide">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '4rem',
          alignItems: 'center',
        }}
          className="heritage-grid"
        >
          {/* Left: Text content */}
          <div style={{ maxWidth: '560px' }}>
            <p style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(201, 169, 110, 0.7)',
              marginBottom: '1.25rem',
              display: 'block',
            }}>
              Vùng Đất Di Sản
            </p>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              color: 'white',
              marginBottom: '1.5rem',
            }}>
              Một nền văn hóa
              <span style={{ display: 'block', fontStyle: 'italic', color: '#c9a96e' }}>
                còn vẹn nguyên
              </span>
              trong đất rừng Ba Tơ
            </h2>

            <p style={{
              fontSize: '1rem',
              lineHeight: 1.85,
              color: 'rgba(253, 246, 236, 0.68)',
              marginBottom: '2.5rem',
              maxWidth: '480px',
            }}>
              Ngọk Bay — xã thuộc huyện Ba Tơ, tỉnh Quảng Ngãi (vùng Kon Tum cũ trước năm 1975) —
              là nơi sinh sống lâu đời của cộng đồng người Bana. Giữa núi rừng hùng vĩ, họ gìn giữ
              những nét văn hóa ngàn năm: từ nghề dệt thổ cẩm, đến nhạc cụ cồng chiêng, lễ hội
              mùa màng và ẩm thực bản địa phong phú.
            </p>

            {/* Stats grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0',
              borderTop: '1px solid rgba(201, 169, 110, 0.2)',
              borderBottom: '1px solid rgba(201, 169, 110, 0.2)',
              padding: '1.75rem 0',
              marginBottom: '2.5rem',
            }}>
              {[
                { num: 'Ba Tơ', label: 'Huyện vùng cao' },
                { num: 'Bana', label: 'Dân tộc chủ thể' },
                { num: '1975', label: 'Năm nhập Quảng Ngãi' },
              ].map((s, i) => (
                <div key={i} style={{
                  textAlign: i === 1 ? 'center' : i === 2 ? 'right' : 'left',
                  paddingRight: i < 2 ? '1.5rem' : '0',
                  paddingLeft: i > 0 ? '1.5rem' : '0',
                  borderRight: i < 2 ? '1px solid rgba(201, 169, 110, 0.15)' : 'none',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.875rem',
                    lineHeight: 1,
                    color: '#c9a96e',
                    marginBottom: '6px',
                  }}>{s.num}</div>
                  <div style={{
                    fontSize: '0.6875rem',
                    letterSpacing: '0.05em',
                    color: 'rgba(253, 246, 236, 0.5)',
                    textTransform: 'uppercase',
                  }}>{s.label}</div>
                </div>
              ))}
            </div>

            <Link href="/van-hoa" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid rgba(201, 169, 110, 0.4)',
              color: 'rgba(253, 246, 236, 0.9)',
              fontWeight: 600,
              fontSize: '0.8125rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '0.875rem 2rem',
              textDecoration: 'none',
              transition: 'border-color 0.3s, background 0.3s, color 0.3s',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#c9a96e';
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(201, 169, 110, 0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201, 169, 110, 0.4)';
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              Khám phá câu chuyện <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right: Image with quote overlay */}
          <div style={{ position: 'relative', display: 'none' }} className="heritage-img-col">
            {/* Main image */}
            <div style={{
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
            }}>
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop"
                alt="Người Bana dệt thổ cẩm tại Ngọk Bay"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Gradient */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(26, 58, 26, 0.6), transparent 60%)',
              }} />
            </div>

            {/* Quote box */}
            <div style={{
              position: 'absolute',
              bottom: '-2rem',
              left: '-2.5rem',
              background: '#c9a96e',
              padding: '1.75rem 2rem',
              maxWidth: '280px',
            }}>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.125rem',
                fontStyle: 'italic',
                color: '#1c1208',
                lineHeight: 1.6,
                marginBottom: '0.75rem',
              }}>
                "Mỗi sợi vải là một câu chuyện, mỗi hoa văn là một ký ức."
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(28, 18, 8, 0.65)', letterSpacing: '0.05em' }}>
                — Nghệ nhân làng Bana, Ngọk Bay
              </p>
            </div>

            {/* Corner decoration */}
            <div style={{
              position: 'absolute',
              top: '-1.5rem',
              right: '-1.5rem',
              width: '5rem',
              height: '5rem',
              border: '1px solid rgba(201, 169, 110, 0.35)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .heritage-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .heritage-img-col {
            display: block !important;
          }
        }
      `}</style>
    </section>
  );
}
