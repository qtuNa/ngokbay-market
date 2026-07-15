'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, ExternalLink, Search, Loader2, Map } from 'lucide-react';
import { fetchApi } from '../../../src/lib/api';
import MarketMap from '../../maps/market-map';

interface Market {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  maps_url?: string;
}

interface ApiResponse {
  success: boolean;
  data: Market[];
  count: number;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function MarketCard({ market }: { market: Market }) {
  const mapsUrl = market.latitude && market.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${market.latitude},${market.longitude}&travelmode=driving`
    : null;

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
      display: 'flex',
      flexDirection: 'column',
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Color bar */}
      <div style={{ height: '5px', background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-gold) 100%)' }} />

      <div style={{ padding: 'var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {/* Icon + Name */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-gold) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.375rem',
            flexShrink: 0,
          }}>
            🏪
          </div>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-text)', lineHeight: 1.3 }}>
              {market.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>
              <MapPin size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>{market.address}</span>
            </div>
          </div>
        </div>

        {/* Coords */}
        {market.latitude && market.longitude && (
          <div style={{
            background: 'var(--color-background)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            fontFamily: 'monospace',
          }}>
            {Number(market.latitude).toFixed(4)}°N, {Number(market.longitude).toFixed(4)}°E
          </div>
        )}

        {/* Added date */}
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Cập nhật: {new Date(market.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'auto' }}>
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                background: 'var(--color-primary)',
                color: 'white',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-2)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-primary-hover)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'var(--color-primary)'; }}
            >
              <ExternalLink size={14} /> Chỉ đường
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function MarketScheduleList() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch markets từ API thật
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '12' });
        if (debouncedSearch) params.append('search', debouncedSearch);
        const res = await fetchApi<ApiResponse>(`/api/markets?${params.toString()}`);
        if (res.success) {
          setMarkets(res.data);
          setTotal(res.count);
          setTotalPages(res.meta.totalPages);
        }
      } catch {
        setError('Không thể tải danh sách phiên chợ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [debouncedSearch, page]);

  // Map markers
  const mapMarkers = markets
    .filter((m) => m.latitude && m.longitude)
    .map((m) => ({
      id: Number(m.id) || Math.random(),
      name: m.name,
      latitude: Number(m.latitude),
      longitude: Number(m.longitude),
      address: m.address,
    }));

  return (
    <section style={{ padding: 'var(--space-10) 0 var(--space-16)', background: 'var(--color-background)' }}>
      <div className="container">
        {/* Search */}
        <div style={{ maxWidth: '520px', margin: '0 auto var(--space-10)', position: 'relative' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
          }} />
          <input
            id="market-search"
            className="input"
            type="text"
            placeholder="Tìm kiếm phiên chợ theo tên hoặc địa chỉ..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              paddingLeft: '48px',
              paddingTop: '14px',
              paddingBottom: '14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.9375rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          />
        </div>

        {/* Map */}
        {mapMarkers.length > 0 && (
          <div style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: 'var(--space-10)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-border)',
          }}>
            <MarketMap markets={mapMarkers} />
          </div>
        )}

        {/* Header */}
        {!loading && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {debouncedSearch ? `Kết quả tìm kiếm "${debouncedSearch}"` : 'Tất cả phiên chợ'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: 'var(--space-1)' }}>
              {total} phiên chợ được tìm thấy
            </p>
          </div>
        )}

        {/* States */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-16)' }}>
            <Loader2 size={40} style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'var(--color-error)', padding: 'var(--space-12)' }}>{error}</div>
        ) : markets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
            <Map size={56} style={{ margin: '0 auto var(--space-4)', color: 'var(--color-text-muted)', opacity: 0.4 }} />
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
              {debouncedSearch ? `Không tìm thấy phiên chợ nào khớp với "${debouncedSearch}"` : 'Chưa có phiên chợ nào được thêm vào hệ thống.'}
            </p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--space-5)',
              marginBottom: 'var(--space-8)',
            }}>
              {markets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn"
                  style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  ← Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="btn"
                    style={{
                      background: page === p ? 'var(--color-primary)' : 'var(--color-border)',
                      color: page === p ? 'white' : 'var(--color-text)',
                      minWidth: '40px',
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn"
                  style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
