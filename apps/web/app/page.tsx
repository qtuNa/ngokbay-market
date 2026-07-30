import type { Metadata } from 'next';
import { HeroBanner } from '../components/pages/home/HeroBanner';
import { CategorySection } from '../components/pages/home/CategorySection';
import { CulturalHighlights } from '../components/pages/home/CulturalHighlights';
import { HomeFeaturedProducts } from '../components/pages/home/HomeFeaturedProducts';
import { HomeMapSection } from '../components/pages/home/HomeMapSection';
import { HomeNewsletterSection } from '../components/pages/home/HomeNewsletterSection';

export const metadata: Metadata = {
  title: 'Chợ Phiên Ngọk Bay — Tinh Hoa Văn Hóa Bana Quảng Ngãi',
  description:
    'Khám phá văn hóa, đặc sản và sản phẩm thủ công truyền thống của người Bana tại vùng cao Ngọk Bay, Ba Tơ, Quảng Ngãi (Kon Tum cũ). Kết nối trực tiếp với nghệ nhân bản địa.',
};

export default function Home() {
  return (
    <div>
      {/* 1. Hero Banner — fullscreen luxury với di sản Ngọk Bay */}
      <HeroBanner />

      {/* 2. Về Ngọk Bay — Heritage section (dark forest bg, 2 cột) */}
      <CategorySection />

      {/* 3. Văn hóa Bana — Editorial collections grid */}
      <CulturalHighlights />

      {/* 4. Đặc sản nổi bật — staggered product grid */}
      <HomeFeaturedProducts />

      {/* 5. Lịch phiên chợ + Cam kết bền vững */}
      <HomeMapSection />

      {/* 6. Newsletter CTA */}
      <HomeNewsletterSection />
    </div>
  );
}
