'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, Clock } from 'lucide-react';

const SCHEDULE_HIGHLIGHTS = [
  { day: 'Thứ 3 & 6', market: 'Chợ phiên Ba Tơ', location: 'Ba Tơ, Quảng Ngãi', note: 'Phiên chợ lớn nhất vùng' },
  { day: 'Thứ 2 & 5', market: 'Chợ phiên Sơn Hà', location: 'Sơn Hà, Quảng Ngãi', note: 'Đặc sản thổ cẩm nhiều nhất' },
  { day: 'Thứ 4 & 7', market: 'Chợ phiên Đức Phổ', location: 'Đức Phổ, Quảng Ngãi', note: 'Nông sản & đặc sản cao nguyên' },
];

const COMMITMENTS = [
  {
    icon: '🌿',
    title: 'Bảo Tồn Văn Hóa',
    desc: 'Mỗi giao dịch góp phần duy trì nghề thủ công truyền thống và bản sắc văn hóa người Bana, Hrê.',
  },
  {
    icon: '🤝',
    title: 'Hỗ Trợ Nghệ Nhân',
    desc: 'Kết nối trực tiếp không qua trung gian — đảm bảo nghệ nhân nhận được giá trị xứng đáng với công sức.',
  },
  {
    icon: '🌱',
    title: 'Nông Sản Tự Nhiên',
    desc: 'Tất cả đặc sản và nông sản được canh tác tự nhiên, không thuốc trừ sâu, đảm bảo sạch và an toàn.',
  },
  {
    icon: '🏡',
    title: 'Phát Triển Cộng Đồng',
    desc: 'Phiên chợ là không gian văn hóa — nơi giữ gìn truyền thống, giao lưu và phát triển kinh tế địa phương bền vững.',
  },
];

export function HomeMapSection() {
  return (
    <>
      {/* === SECTION 1: Lịch phiên chợ — Asymmetric layout === */}
      <section style={{ background: '#fdf6ec', padding: '6rem 0' }}>
        <div className="container-wide">
          <p style={{
            fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.3em',
            textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.75rem',
          }}>
            Lịch Phiên Chợ
          </p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400, lineHeight: 1.1, color: '#1c1208',
            marginBottom: '3.5rem',
          }}>
            Các Phiên Chợ
            <em style={{ fontStyle: 'italic', color: '#2d5a27' }}> Truyền Thống</em>
          </h2>

          {/* Asymmetric bento grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1rem',
          }} className="schedule-grid">

            {/* Big left card: image + text */}
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '460px',
            }} className="schedule-big-card">
              <img
                src="https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=900&h=600&fit=crop"
                alt="Chợ phiên vùng cao Quảng Ngãi"
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26,58,26,0.92) 0%, rgba(26,58,26,0.4) 55%, transparent)',
              }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '2.5rem 2rem',
              }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 400, color: 'white',
                  marginBottom: '0.75rem', lineHeight: 1.15,
                }}>
                  Mỗi phiên chợ<br />là một <em style={{ fontStyle: 'italic', color: '#c9a96e' }}>lễ hội</em> nhỏ
                </h3>
                <p style={{ color: 'rgba(253,246,236,0.75)', fontSize: '0.9375rem', lineHeight: 1.7, maxWidth: '360px' }}>
                  Người Bana mang sản phẩm trao đổi, giao lưu văn hóa và gặp gỡ bạn bè trong không khí lễ hội đặc trưng của vùng cao.
                </p>
                <Link href="/lich-phien" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginTop: '1.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#c9a96e',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(201,169,110,0.4)',
                  paddingBottom: '2px',
                  transition: 'borderColor 0.3s',
                }}>
                  Xem lịch đầy đủ <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right column: schedule cards + CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {SCHEDULE_HIGHLIGHTS.map((item, i) => (
                <div key={i} style={{
                  background: 'white',
                  border: '1px solid #e8d9c0',
                  padding: '1.5rem',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  cursor: 'default',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(45,90,39,0.12)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Clock size={13} color="#c9a96e" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: '#c9a96e', textTransform: 'uppercase' }}>{item.day}</span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 400, color: '#1c1208', marginBottom: '0.25rem' }}>{item.market}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={12} color="#8b5e3c" />
                        <span style={{ fontSize: '0.8125rem', color: '#8b5e3c' }}>{item.location}</span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 600, color: '#2d5a27',
                      background: 'rgba(45,90,39,0.08)',
                      padding: '0.25rem 0.625rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>{item.note}</span>
                  </div>
                </div>
              ))}

              {/* CTA card — gold accent */}
              <div style={{
                background: '#c9a96e',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                <Clock size={2.25 * 16} color="#1c1208" />
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem', fontWeight: 400, color: '#1c1208',
                }}>Đăng Ký Nhận<br />Lịch Phiên Chợ</h3>
                <p style={{ fontSize: '0.875rem', color: 'rgba(28,18,8,0.75)', lineHeight: 1.65 }}>
                  Nhận thông báo trước mỗi phiên chợ và khám phá những sản phẩm mới nhất từ nghệ nhân Ngọk Bay.
                </p>
                <Link href="/lich-phien" style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#1c1208',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.7'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
                >
                  Xem lịch phiên <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION 2: Cam kết bền vững === */}
      <section style={{ background: '#f5ede0', padding: '6rem 0' }}>
        <div className="container-wide">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '4rem',
          }} className="commitments-grid">

            {/* Left: sticky header */}
            <div className="commitments-sticky">
              <p style={{
                fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.3em',
                textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.75rem',
              }}>Cam Kết Của Chúng Tôi</p>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 400, lineHeight: 1.1, color: '#1c1208',
                marginBottom: '1.5rem',
              }}>
                Xây Dựng
                <span style={{ display: 'block', fontStyle: 'italic', color: '#2d5a27' }}>Tương Lai Bền Vững</span>
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: '#6b5439', marginBottom: '2rem', maxWidth: '380px' }}>
                Chúng tôi tin rằng việc bảo tồn văn hóa và phát triển kinh tế địa phương không hề mâu thuẫn — chúng cùng nhau tạo nên sức sống cho cộng đồng Ngọk Bay.
              </p>
              <div style={{
                display: 'inline-block',
                padding: '1.25rem 1.75rem',
                background: 'white',
                borderLeft: '3px solid #c9a96e',
              }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', color: '#c9a96e', lineHeight: 1 }}>100%</div>
                <div style={{ fontSize: '0.8125rem', color: '#6b5439', marginTop: '4px' }}>Nghệ nhân bản địa</div>
              </div>
            </div>

            {/* Right: 4 cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {COMMITMENTS.map((c, i) => (
                <div key={i} style={{
                  background: 'white',
                  padding: '2rem',
                  border: '1px solid #e8d9c0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  cursor: 'default',
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 30px rgba(45,90,39,0.1)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '2.25rem' }}>{c.icon}</span>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 400, color: '#1c1208', lineHeight: 1.25 }}>{c.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#6b5439', lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .schedule-grid {
              grid-template-columns: 5fr 4fr !important;
            }
            .schedule-big-card {
              min-height: 600px !important;
            }
            .commitments-grid {
              grid-template-columns: 2fr 3fr !important;
            }
            .commitments-sticky {
              position: sticky;
              top: 6rem;
              align-self: start;
            }
          }
        `}</style>
      </section>
    </>
  );
}
