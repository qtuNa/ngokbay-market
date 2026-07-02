import MarketMap from "../components/maps/market-map";

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

export default function Home() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>Ngok Bay Market Map</h1>
      <p style={{ marginTop: 0, color: "#475569" }}>
        Bản đồ các phiên chợ với marker, popup và nút tính khoảng cách từ vị trí
        hiện tại.
      </p>
      <MarketMap markets={sampleMarkets} />
    </main>
  );
}
