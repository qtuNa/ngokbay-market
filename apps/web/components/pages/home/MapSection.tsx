import MarketMap from '../../maps/market-map';

const sampleMarkets = [
  {
    id: 1,
    name: "Chợ phiên Ba Tơ",
    latitude: 14.848,
    longitude: 108.999,
    address: "Ba Tơ, Quảng Ngãi",
  },
  {
    id: 2,
    name: "Chợ phiên Sơn Hà",
    latitude: 14.77,
    longitude: 108.91,
    address: "Sơn Hà, Quảng Ngãi",
  },
  {
    id: 3,
    name: "Chợ phiên Đức Phổ",
    latitude: 14.99,
    longitude: 108.95,
    address: "Đức Phổ, Quảng Ngãi",
  },
];

export function MapSection() {
  return (
    <section id="market-map" style={{ backgroundColor: 'var(--color-background)', padding: 'var(--space-8) 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h2 className="text-xl font-bold mb-2">Bản đồ các phiên chợ</h2>
          <p className="text-muted max-w-2xl mx-auto" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Tìm các phiên chợ truyền thống gần bạn nhất để trực tiếp trải nghiệm không khí mua bán đậm chất văn hóa bản địa.
          </p>
        </div>
        
        <div className="card" style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)' }}>
          <MarketMap markets={sampleMarkets} />
        </div>
      </div>
    </section>
  );
}
