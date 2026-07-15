import type { Metadata } from 'next';
import { ThoCamHero } from '../../components/pages/tho-cam/ThoCamHero';
import { ThoCamContent } from '../../components/pages/tho-cam/ThoCamContent';

export const metadata: Metadata = {
  title: 'Thổ cẩm Bana — Nghệ thuật dệt truyền thống | Chợ Phiên Ngok Bay',
  description:
    'Khám phá nghệ thuật dệt thổ cẩm truyền thống của người Bana vùng cao Quảng Ngãi. Từng hoa văn, từng sợi chỉ đều mang câu chuyện văn hóa ngàn năm.',
};

export default function ThoCamPage() {
  return (
    <div>
      <ThoCamHero />
      <ThoCamContent />
    </div>
  );
}
