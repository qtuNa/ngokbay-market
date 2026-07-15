import type { Metadata } from 'next';
import { ScheduleHero } from '../../components/pages/market-schedule/ScheduleHero';
import { MarketScheduleList } from '../../components/pages/market-schedule/MarketScheduleList';

export const metadata: Metadata = {
  title: 'Lịch phiên chợ — Chợ Phiên Ngok Bay',
  description:
    'Xem lịch tổ chức các phiên chợ truyền thống tại Quảng Ngãi. Tìm phiên chợ gần bạn để trực tiếp trải nghiệm và mua sắm đặc sản bản địa.',
};

export default function LichPhienPage() {
  return (
    <div>
      <ScheduleHero />
      <MarketScheduleList />
    </div>
  );
}
