import type { Metadata } from 'next';
import { HeroBanner } from '../components/pages/home/HeroBanner';
import { CulturalHighlights } from '../components/pages/home/CulturalHighlights';
import { HomeFeaturedProducts } from '../components/pages/home/HomeFeaturedProducts';
import { HomeMapSection } from '../components/pages/home/HomeMapSection';

export const metadata: Metadata = {
  title: 'Chợ Phiên Ngok Bay — Đặc sản vùng cao Quảng Ngãi',
  description:
    'Nền tảng kết nối trực tiếp khách hàng với các tiểu thương, nghệ nhân bản địa người Bana. Khám phá nông sản OCOP, thổ cẩm và thủ công mỹ nghệ từ vùng cao Quảng Ngãi.',
};

export default function Home() {
  return (
    <div>
      {/* 1. Banner lớn (admin chỉnh được) */}
      <HeroBanner />

      {/* 2. Giới thiệu sản phẩm văn hóa (câu chuyện) */}
      <CulturalHighlights />

      {/* 3. Danh sách sản phẩm nổi bật để mua */}
      <HomeFeaturedProducts />

      {/* 4. Bản đồ phiên chợ */}
      <HomeMapSection />
    </div>
  );
}
