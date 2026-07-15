'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const PATTERNS = [
  {
    name: 'Hoa văn Chim Phượng',
    description: 'Biểu tượng may mắn và thịnh vượng trong văn hóa Bana, thường dùng cho trang phục lễ cưới và lễ hội quan trọng.',
    colors: ['#dc2626', '#1d4ed8', '#f59e0b', '#ffffff'],
  },
  {
    name: 'Hoa văn Sông Nước',
    description: 'Phản ánh sự gắn kết của người Bana với thiên nhiên — những con sóng uốn lượn tượng trưng cho sự sinh sôi và dồi dào.',
    colors: ['#0891b2', '#14532d', '#fbbf24', '#ffffff'],
  },
  {
    name: 'Hoa văn Thác Đổ',
    description: 'Lấy cảm hứng từ thác nước hùng vĩ vùng Tây Nguyên, thể hiện sức mạnh và kiên cường của cộng đồng.',
    colors: ['#7c3aed', '#0f766e', '#f59e0b', '#ffffff'],
  },
  {
    name: 'Hoa văn Cây Cổ Thụ',
    description: 'Hình ảnh cây đa, cây bồ đề — trung tâm tín ngưỡng làng bản, nơi thần linh ngự trị và cộng đồng tụ họp.',
    colors: ['#166534', '#92400e', '#fbbf24', '#ffffff'],
  },
];

const ARTISANS = [
  {
    name: 'Nghệ nhân Y Blớt',
    age: 67,
    village: 'Làng Kon Bơ Băng, Sơn Hà',
    specialty: 'Dệt thổ cẩm nghi lễ',
    experience: '50 năm',
    emoji: '👵',
  },
  {
    name: 'Nghệ nhân H\'Mă',
    age: 52,
    village: 'Làng Teng, Ba Tơ',
    specialty: 'Hoa văn hình học',
    experience: '35 năm',
    emoji: '👩‍🎨',
  },
  {
    name: 'Nghệ nhân Y Linh',
    age: 44,
    village: 'Làng Bok, Sơn Hà',
    specialty: 'Nhuộm chàm tự nhiên',
    experience: '28 năm',
    emoji: '🧑‍🎨',
  },
];

const STEPS = [
  { step: '01', title: 'Thu hoạch nguyên liệu', desc: 'Chỉ cotton và chỉ lụa được thu từ thiên nhiên. Cây chàm, vỏ cây rừng được dùng để tạo màu sắc tự nhiên bền màu.' },
  { step: '02', title: 'Nhuộm và chuẩn bị sợi', desc: 'Sợi được nhuộm theo công thức truyền thống, phơi nắng nhiều ngày để màu bám chắc vào từng sợi vải.' },
  { step: '03', title: 'Dệt trên khung tay', desc: 'Khung dệt truyền thống bằng gỗ — mỗi hoa văn phức tạp có thể mất 2-3 tuần để hoàn thiện một mảnh vải.' },
  { step: '04', title: 'Hoàn thiện và may cắt', desc: 'Vải thổ cẩm được may thành trang phục, túi xách, khăn choàng theo đặt hàng và truyền thống của từng dịp.' },
];

export function ThoCamContent() {
  return (
    <div>
      {/* Intro */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-background)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--space-10)',
            alignItems: 'center',
          }}>
            {/* Visual placeholder */}
            <div style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
              height: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8rem',
              boxShadow: 'var(--shadow-xl)',
            }}>
              🧵
            </div>
            <div>
              <div style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
                Nghề thủ công truyền thống
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: 'var(--space-5)', color: 'var(--color-text)' }}>
                Mỗi tấm vải là một câu chuyện chưa bao giờ kể bằng lời
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, marginBottom: 'var(--space-5)', fontSize: '0.9375rem' }}>
                Thổ cẩm Bana không chỉ là vải — đó là nhật ký của một cộng đồng, ghi lại mùa màng, tín ngưỡng, niềm vui và nỗi buồn. Người phụ nữ Bana bắt đầu học dệt từ năm 10 tuổi, và cả đời họ gửi tâm tư vào từng hoa văn.
              </p>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.9375rem' }}>
                Ngày nay, khi các nghề truyền thống đang dần mai một, Chợ Phiên Ngok Bay kết nối những nghệ nhân Bana với người mua trên khắp cả nước — mang lại thu nhập bền vững và gìn giữ di sản văn hóa cho thế hệ mai sau.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hoa văn */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <h2 className="section-title">Hoa văn thổ cẩm tiêu biểu</h2>
            <p className="section-subtitle mx-auto" style={{ textAlign: 'center' }}>
              Mỗi hoa văn mang một ý nghĩa riêng — được trao truyền từ mẹ sang con, từ thế hệ này sang thế hệ khác.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
            {PATTERNS.map((p, i) => (
              <div key={i} style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--color-border)',
                transition: 'transform var(--transition-normal)',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
              >
                {/* Color swatches */}
                <div style={{ height: '8px', display: 'flex' }}>
                  {p.colors.map((c, ci) => (
                    <div key={ci} style={{ flex: 1, background: c }} />
                  ))}
                </div>
                {/* Visual */}
                <div style={{
                  height: '120px',
                  background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  opacity: 0.8,
                }}>
                  🔷
                </div>
                <div style={{ padding: 'var(--space-5)' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>{p.name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quy trình dệt */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-background)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <h2 className="section-title">Quy trình dệt thổ cẩm</h2>
            <p className="section-subtitle mx-auto" style={{ textAlign: 'center' }}>
              Từ sợi chỉ thô đến tấm vải hoàn chỉnh — một hành trình của sự kiên nhẫn và tâm huyết.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', position: 'relative' }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'rgba(234,88,12,0.15)',
                  marginBottom: 'var(--space-3)',
                  lineHeight: 1,
                }}>{s.step}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 'var(--space-3)', color: 'var(--color-text)' }}>{s.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nghệ nhân */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <h2 className="section-title">Nghệ nhân thổ cẩm</h2>
            <p className="section-subtitle mx-auto" style={{ textAlign: 'center' }}>
              Những người lưu giữ ngọn lửa truyền thống — mỗi người là một kho tàng kiến thức sống.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
            {ARTISANS.map((a, i) => (
              <div key={i} style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-6)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 'var(--space-3)',
              }}>
                <div style={{ fontSize: '4rem' }}>{a.emoji}</div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-text)', marginBottom: 'var(--space-1)' }}>{a.name}</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{a.age} tuổi · {a.village}</p>
                </div>
                <div style={{
                  background: 'rgba(234,88,12,0.08)',
                  color: 'var(--color-primary)',
                  borderRadius: 'var(--radius-full)',
                  padding: 'var(--space-1) var(--space-4)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                }}>
                  {a.specialty}
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  Kinh nghiệm: <strong style={{ color: 'var(--color-text)' }}>{a.experience}</strong>
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
              Muốn sở hữu một tác phẩm thổ cẩm của những nghệ nhân này?
            </p>
            <Link
              href="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                background: 'linear-gradient(135deg, var(--color-earth) 0%, var(--color-gold) 100%)',
                color: 'white',
                fontWeight: 700,
                padding: 'var(--space-3) var(--space-8)',
                borderRadius: 'var(--radius-full)',
                fontSize: '1rem',
              }}
            >
              Mua thổ cẩm <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
