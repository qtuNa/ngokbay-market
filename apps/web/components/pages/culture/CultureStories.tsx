'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Story {
  id: string;
  emoji: string;
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  gradient: string;
  link: string;
}

const STORIES: Story[] = [
  {
    id: 'ocop-forest',
    emoji: '🍯',
    tag: 'Nông sản OCOP',
    title: 'Mật ong rừng Sơn Hà — Vàng lỏng của núi rừng',
    excerpt:
      'Từ những cánh rừng nguyên sinh trên dãy Trường Sơn, người Bana đã gắn bó với nghề nuôi ong từ bao đời nay. Mỗi lọ mật ong rừng Sơn Hà không chỉ là thực phẩm — đó là tinh hoa của rừng xanh, của bàn tay người thợ kiên nhẫn, và của đất trời Quảng Ngãi.',
    readTime: '4 phút đọc',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
    link: '/products',
  },
  {
    id: 'mang-kho',
    emoji: '🎋',
    tag: 'Đặc sản vùng cao',
    title: 'Măng khô Ba Tơ — Vị núi rừng trên mâm cơm',
    excerpt:
      'Mùa măng bắt đầu từ tháng 3, khi những tia nắng đầu hè chạm vào đất ẩm. Người Bana ở Ba Tơ thu hoạch măng tươi theo cách truyền thống — luộc chín, phơi nắng nhiều ngày — tạo ra loại măng khô mang hương vị đặc trưng không nơi nào có được.',
    readTime: '3 phút đọc',
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
    link: '/products',
  },
  {
    id: 'le-hoi',
    emoji: '🥁',
    tag: 'Lễ hội & Tín ngưỡng',
    title: 'Lễ hội cồng chiêng — Ngôn ngữ của linh hồn',
    excerpt:
      'Tiếng cồng chiêng của người Bana vang lên trong những đêm lễ hội, kết nối người sống với tổ tiên, kết nối con người với thiên nhiên. Được UNESCO công nhận là Di sản Văn hóa Phi vật thể, âm nhạc cồng chiêng Tây Nguyên là linh hồn của vùng đất này.',
    readTime: '5 phút đọc',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
    link: '/van-hoa',
  },
  {
    id: 'nha-rong',
    emoji: '🏡',
    tag: 'Kiến trúc truyền thống',
    title: 'Nhà rông — Trái tim của bản làng',
    excerpt:
      'Nhà rông là trung tâm sinh hoạt cộng đồng, nơi diễn ra các nghi lễ quan trọng và cuộc họp của làng. Được dựng từ gỗ và tranh tre nứa lá, mỗi nhà rông là tác phẩm kiến trúc phản ánh sự thịnh vượng và đoàn kết của cả cộng đồng.',
    readTime: '4 phút đọc',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
    link: '/van-hoa',
  },
  {
    id: 'tieu-rung',
    emoji: '🌶️',
    tag: 'Nông sản OCOP',
    title: 'Tiêu rừng Sơn Hà — Vua gia vị bản địa',
    excerpt:
      'Tiêu rừng Sơn Hà được trồng theo phương pháp truyền thống không hóa chất, hấp thụ khoáng chất từ đất đỏ bazan vùng núi. Hạt tiêu to đều, thơm nồng và cay đặc trưng — đây là lý do tiêu Sơn Hà được đánh giá 4 sao OCOP cấp tỉnh.',
    readTime: '3 phút đọc',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    link: '/products',
  },
  {
    id: 'truyen-thuyet',
    emoji: '📖',
    tag: 'Truyền thuyết & Sử thi',
    title: 'Sử thi Đăm San — Hùng ca của người Bana',
    excerpt:
      'Đăm San là sử thi anh hùng nổi tiếng nhất của người Bana, kể về chàng tù trưởng dũng cảm và những cuộc chinh phạt huyền thoại. Được kể bằng lời thơ giàu hình ảnh, sử thi này là kho tàng văn học truyền khẩu quý giá của dân tộc.',
    readTime: '6 phút đọc',
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)',
    link: '/van-hoa',
  },
];

function StoryCard({ story, featured = false }: { story: Story; featured?: boolean }) {
  if (featured) {
    return (
      <div style={{
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-xl)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        transition: 'transform var(--transition-normal)',
      }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
      >
        {/* Visual */}
        <div style={{
          background: story.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '6rem',
          minHeight: '280px',
          opacity: 0.85,
        }}>
          {story.emoji}
        </div>
        {/* Content */}
        <div style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-3)',
          }}>
            {story.tag}
          </span>
          <h3 style={{ fontSize: '1.375rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 'var(--space-4)', color: 'var(--color-text)' }}>
            {story.title}
          </h3>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '0.9375rem', marginBottom: 'var(--space-5)' }}>
            {story.excerpt}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>⏱ {story.readTime}</span>
            <Link href={story.link} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}>
              Đọc thêm <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-xl)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-md)';
      }}
    >
      {/* Top gradient visual */}
      <div style={{
        background: story.gradient,
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3.5rem',
        opacity: 0.9,
      }}>
        {story.emoji}
      </div>
      <div style={{ padding: 'var(--space-5)' }}>
        <span style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: 'var(--color-primary)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: 'var(--space-2)',
        }}>
          {story.tag}
        </span>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, lineHeight: 1.35, marginBottom: 'var(--space-3)', color: 'var(--color-text)' }}>
          {story.title}
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: 'var(--space-4)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {story.excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>⏱ {story.readTime}</span>
          <Link href={story.link} style={{
            fontSize: '0.8125rem',
            color: 'var(--color-primary)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            Đọc <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CultureStories() {
  const [featured, ...rest] = STORIES;
  return (
    <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-background)' }}>
      <div className="container">
        {/* Featured */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <StoryCard story={featured!} featured />
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}>
          {rest.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-12)' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            Muốn tìm hiểu thêm về thổ cẩm và nghề dệt truyền thống?
          </p>
          <Link
            href="/tho-cam"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'var(--color-forest-mid)',
              color: 'white',
              fontWeight: 700,
              padding: 'var(--space-3) var(--space-8)',
              borderRadius: 'var(--radius-full)',
              fontSize: '1rem',
              transition: 'background var(--transition-fast)',
            }}
          >
            🧵 Khám phá Thổ cẩm Bana <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
