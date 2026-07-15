import type { Metadata } from 'next';
import { HeroBanner } from '../components/pages/home/HeroBanner';
import { CategorySection } from '../components/pages/home/CategorySection';
import { HomeFeaturedProducts } from '../components/pages/home/HomeFeaturedProducts';
import { CulturalHighlights } from '../components/pages/home/CulturalHighlights';
import { HomeMapSection } from '../components/pages/home/HomeMapSection';

export const metadata: Metadata = {
  title: 'Chợ Phiên Ngọk Bay — Đặc sản vùng cao Quảng Ngãi',
  description:
    'Nền tảng kết nối trực tiếp khách hàng với các tiểu thương, nghệ nhân bản địa người Bana. Khám phá nông sản OCOP, thổ cẩm và thủ công mỹ nghệ từ vùng cao Quảng Ngãi.',
};

export default function Home() {
  return (
    <div>
      {/* 1. Banner lớn với ảnh làng bản */}
      <HeroBanner />

      {/* 2. Danh mục sản phẩm (thanh ngang dưới banner) */}
      <CategorySection />

      {/* 3. Sản phẩm nổi bật */}
      <HomeFeaturedProducts />

      {/* 4. Văn hóa & Con người */}
      <CulturalHighlights />

      {/* 5. Bản đồ phiên chợ */}
      <HomeMapSection />
    </div>
  );
}
