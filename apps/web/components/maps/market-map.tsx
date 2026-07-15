// apps/web/components/maps/market-map.tsx
// Wrapper mỏng — chỉ re-export MarketMapItem và render dynamic component.
// Toàn bộ Leaflet code nằm trong market-map-inner.tsx để tránh SSR.
import dynamic from 'next/dynamic';
export type { MarketMapItem } from './market-map-inner';

const MarketMap = dynamic(() => import('./market-map-inner'), {
  ssr: false,
  loading: () => (
    <div style={{
      height: '420px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fef3c7',
      borderRadius: 16,
      color: '#6b5c3e',
      fontSize: '0.9375rem',
    }}>
      🗺️ Đang tải bản đồ...
    </div>
  ),
});

export default MarketMap;
