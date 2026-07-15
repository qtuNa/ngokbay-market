import type { Metadata } from 'next';
import { CultureHero } from '../../components/pages/culture/CultureHero';
import { CultureStories } from '../../components/pages/culture/CultureStories';

export const metadata: Metadata = {
  title: 'Văn hóa Bana — Câu chuyện từ vùng cao | Chợ Phiên Ngok Bay',
  description:
    'Khám phá văn hóa phong phú của người Bana, Hrê vùng cao Quảng Ngãi — nông sản OCOP, tín ngưỡng, lễ hội và nghề truyền thống được gìn giữ qua nhiều thế hệ.',
};

export default function VanHoaPage() {
  return (
    <div>
      <CultureHero />
      <CultureStories />
    </div>
  );
}
