'use client';

// apps/web/components/maps/market-map-inner.tsx
// File này chứa toàn bộ code Leaflet — chỉ được import qua dynamic() với ssr:false
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type MarketMapItem = {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
};

type Props = {
  markets: MarketMapItem[];
  center?: [number, number];
};

const DEFAULT_CENTER: [number, number] = [14.848, 108.999];

const createMarketIcon = () =>
  L.divIcon({
    className: 'market-map-marker',
    html: `<div style="width:18px;height:18px;border-radius:999px;background:#c2410c;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

export default function MarketMapInner({ markets, center = DEFAULT_CENTER }: Props) {
  const [selected, setSelected] = useState<MarketMapItem | null>(null);
  const [dist, setDist] = useState<string | null>(null);
  const [distErr, setDistErr] = useState<string | null>(null);
  const [calc, setCalc] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSelected(markets[0] ?? null);
    setDist(null);
    setDistErr(null);
  }, [markets]);

  const handleDistance = () => {
    if (!selected) return;
    if (!('geolocation' in navigator)) {
      setDistErr('Trình duyệt không hỗ trợ Geolocation.');
      return;
    }
    setCalc(true);
    setDistErr(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setDist(`${calcDistance(coords.latitude, coords.longitude, selected.latitude, selected.longitude)} km`);
        setCalc(false);
      },
      () => {
        setDistErr('Không thể lấy vị trí. Hãy cho phép trình duyệt truy cập.');
        setCalc(false);
      },
      { timeout: 10000 },
    );
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* Info + Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          {selected ? (
            <>
              <strong style={{ color: '#1c1008' }}>{selected.name}</strong>
              <div style={{ fontSize: '0.8125rem', color: '#6b5c3e', marginTop: 2 }}>{selected.address}</div>
              {dist && <div style={{ marginTop: 4, fontSize: '0.8125rem', color: '#14532d', fontWeight: 600 }}>📍 {dist} từ vị trí của bạn</div>}
              {distErr && <div style={{ marginTop: 4, fontSize: '0.8125rem', color: '#dc2626' }}>{distErr}</div>}
            </>
          ) : (
            <span style={{ fontSize: '0.875rem', color: '#6b5c3e' }}>Nhấn vào marker để chọn phiên chợ</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleDistance}
          disabled={!selected || calc}
          style={{
            border: 'none',
            borderRadius: 999,
            padding: '8px 18px',
            background: '#2d6a2d',
            color: '#fff',
            cursor: !selected || calc ? 'not-allowed' : 'pointer',
            opacity: !selected || calc ? 0.6 : 1,
            fontSize: '0.8125rem',
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          {calc ? '⏳ Đang xác định...' : '📡 Tính khoảng cách'}
        </button>
      </div>

      {/* Map */}
      {!isMounted ? (
        <div style={{ height: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef3c7', borderRadius: 16, color: '#6b5c3e' }}>
          🗺️ Đang tải bản đồ...
        </div>
      ) : markets.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#6b5c3e', fontSize: '0.875rem' }}>
          Chưa có dữ liệu phiên chợ.
        </div>
      ) : (
        <div style={{ height: '420px', width: '100%', borderRadius: 16, overflow: 'hidden', border: '1px solid #f0e4cc' }}>
          <MapContainer
            key={`map-${markets.map(m => m.id).join('-')}`}
            center={center}
            zoom={9}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markets.map((market) => (
              <Marker
                key={market.id}
                position={[market.latitude, market.longitude]}
                icon={createMarketIcon()}
                eventHandlers={{ click: () => { setSelected(market); setDist(null); setDistErr(null); } }}
              >
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <strong>{market.name}</strong><br />
                    <span style={{ fontSize: '0.8125rem', color: '#6b5c3e' }}>{market.address}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
