import type { Metadata } from 'next';
import { ContactHero } from '../../components/pages/contact/ContactHero';
import { ContactContent } from '../../components/pages/contact/ContactContent';

export const metadata: Metadata = {
  title: 'Liên hệ — Chợ Phiên Ngok Bay',
  description:
    'Liên hệ với Chợ Phiên Ngok Bay để mua sắm, đầu tư hoặc hợp tác. Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.',
};

export default function LienHePage() {
  return (
    <div>
      <ContactHero />
      <ContactContent />
    </div>
  );
}
