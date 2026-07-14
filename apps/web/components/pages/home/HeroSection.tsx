import Link from 'next/link';

export function HeroSection() {
  return (
    <section style={{ 
      backgroundColor: 'var(--color-primary)', 
      color: 'white',
      padding: 'var(--space-8) 0',
      textAlign: 'center'
    }}>
      <div className="container">
        <h1 className="text-xl font-bold mb-4" style={{ fontSize: '2.5rem', lineHeight: 1.2 }}>
          Mang Bản Sắc Vùng Cao <br /> Đến Tận Tay Bạn
        </h1>
        <p className="text-lg mb-6" style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
          Nền tảng kết nối trực tiếp với các tiểu thương, nghệ nhân bản địa người Bana. Khám phá nông sản OCOP, thổ cẩm và thủ công mỹ nghệ.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
          <Link href="/products" className="btn" style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}>
            Mua sắm ngay
          </Link>
          <a href="#market-map" className="btn" style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white' }}>
            Tìm phiên chợ
          </a>
        </div>
      </div>
    </section>
  );
}
