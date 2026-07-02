"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

export type MarketMapItem = {
  id: string | number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
};

type MarketMapProps = {
  markets: MarketMapItem[];
  center?: [number, number];
};

const DEFAULT_CENTER: [number, number] = [14.848, 108.999];

const createMarketIcon = () =>
  L.divIcon({
    className: "market-map-marker",
    html: `
      <div style="width:18px;height:18px;border-radius:999px;background:#0f766e;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);"></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

const calculateHaversineDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const radius = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return (radius * c).toFixed(2);
};

function MarketMapContent({
  markets,
  center = DEFAULT_CENTER,
}: MarketMapProps) {
  const [selectedMarket, setSelectedMarket] = useState<MarketMapItem | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setSelectedMarket(markets[0] ?? null);
    setDistance(null);
    setDistanceError(null);
  }, [markets]);

  const handleCalculateDistance = () => {
    if (!selectedMarket) {
      setDistanceError("Vui lòng chọn một phiên chợ.");
      return;
    }

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setDistanceError("Trình duyệt của bạn không hỗ trợ Geolocation.");
      return;
    }

    setIsCalculating(true);
    setDistanceError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const km = calculateHaversineDistanceKm(
          coords.latitude,
          coords.longitude,
          selectedMarket.latitude,
          selectedMarket.longitude,
        );
        setDistance(`${km} km`);
        setIsCalculating(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Bạn đã từ chối quyền truy cập vị trí."
            : "Không thể lấy vị trí hiện tại của bạn.";

        setDistanceError(message);
        setIsCalculating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "1.125rem" }}>
            Bản đồ các phiên chợ
          </h2>
          <p style={{ margin: "4px 0 0", color: "#475569" }}>
            Nhấn vào marker để chọn phiên chợ và tính khoảng cách từ vị trí
            hiện tại của bạn.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCalculateDistance}
          disabled={!selectedMarket || isCalculating}
          style={{
            border: "none",
            borderRadius: 999,
            padding: "0.6rem 1rem",
            background: "#0f766e",
            color: "#fff",
            cursor: !selectedMarket || isCalculating ? "not-allowed" : "pointer",
            opacity: !selectedMarket || isCalculating ? 0.7 : 1,
          }}
        >
          {isCalculating ? "Đang xác định..." : "Tính khoảng cách"}
        </button>
      </div>

      {selectedMarket ? (
        <div
          style={{
            padding: "0.75rem 1rem",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            color: "#0f172a",
          }}
        >
          <strong>{selectedMarket.name}</strong>
          <div style={{ marginTop: 4, color: "#475569" }}>
            {selectedMarket.address}
          </div>
          {distance ? <div style={{ marginTop: 6 }}>Khoảng cách: {distance}</div> : null}
          {distanceError ? (
            <div style={{ marginTop: 6, color: "#b91c1c" }}>{distanceError}</div>
          ) : null}
        </div>
      ) : null}

      {markets.length === 0 ? (
        <div
          style={{
            padding: "1rem",
            border: "1px dashed #cbd5e1",
            borderRadius: 12,
            color: "#64748b",
          }}
        >
          Chưa có dữ liệu phiên chợ để hiển thị trên bản đồ.
        </div>
      ) : (
        <div
          style={{
            height: "420px",
            width: "100%",
            overflow: "hidden",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
          }}
        >
          <MapContainer
            center={center}
            zoom={12}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {markets.map((market) => (
              <Marker
                key={market.id}
                position={[market.latitude, market.longitude]}
                icon={createMarketIcon()}
                eventHandlers={{
                  click: () => {
                    setSelectedMarket(market);
                    setDistance(null);
                    setDistanceError(null);
                  },
                }}
              >
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <strong>{market.name}</strong>
                    <br />
                    {market.address}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </section>
  );
}

const MarketMap = (props: MarketMapProps) => <MarketMapContent {...props} />;

export default dynamic(() => Promise.resolve(MarketMap), {
  ssr: false,
});
