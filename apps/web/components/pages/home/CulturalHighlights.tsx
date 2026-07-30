'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Pencil, X, Check, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../src/store/useAuthStore';
import { fetchApi } from '../../../src/lib/api';

export interface CulturalItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string;
  count?: string;
}

const DEFAULT_HIGHLIGHTS: CulturalItem[] = [
  {
    id: 'weaving',
    title: 'Dệt Thổ Cẩm',
    description: 'Nghề dệt thủ công của người phụ nữ Bana — mỗi tấm vải là hành trình qua nhiều thế hệ với hoa văn hình học độc đáo.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop',
    link: '/tho-cam',
    count: '24 sản phẩm',
  },
  {
    id: 'music',
    title: 'Nhạc Cụ Truyền Thống',
    description: 'Cồng chiêng, đàn T\'rưng, kèn bầu — những âm thanh của đại ngàn còn vang vọng trong từng lễ hội cộng đồng.',
    image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=800&fit=crop',
    link: '/van-hoa',
    count: '12 loại nhạc cụ',
  },
  {
    id: 'food',
    title: 'Ẩm Thực & Đặc Sản',
    description: 'Rượu cần, thịt nướng lá rừng, nếp than, mật ong rừng — đặc sản thiên nhiên từ núi rừng Ba Tơ.',
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=800&fit=crop',
    link: '/products?category=food',
    count: '32 sản phẩm',
  },
  {
    id: 'festival',
    title: 'Lễ Hội & Cộng Đồng',
    description: 'Lễ cúng lúa mới, hội đâm trâu, lễ mừng nhà Rông — nơi văn hóa và tâm linh người Bana hội tụ.',
    image_url: 'https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=600&h=800&fit=crop',
    link: '/van-hoa',
    count: '5 lễ hội lớn',
  },
];

function EditModal({
  item, onSave, onClose, isSaving, saveError,
}: {
  item: CulturalItem;
  onSave: (d: CulturalItem) => void;
  onClose: () => void;
  isSaving: boolean;
  saveError: string | null;
}) {
  const [form, setForm] = useState<CulturalItem>(item);
  const f = (k: keyof CulturalItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>Chỉnh sửa: {item.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}><X size={20} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label><span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>Tiêu đề</span><input className="input" value={form.title} onChange={f('title')} /></label>
          <label><span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>Mô tả</span><textarea className="input" rows={4} value={form.description} onChange={f('description')} style={{ fontFamily: 'inherit', resize: 'vertical' }} /></label>
          <label><span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>URL ảnh</span><input className="input" type="url" value={form.image_url ?? ''} onChange={f('image_url')} placeholder="https://..." /></label>
          <label><span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>Link</span><input className="input" value={form.link} onChange={f('link')} /></label>
          <label><span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>Số lượng (VD: 24 sản phẩm)</span><input className="input" value={form.count ?? ''} onChange={f('count')} /></label>
        </div>
        {saveError && <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginTop: 10 }}>{saveError}</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose} style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}>Hủy</button>
          <button className="btn btn-primary" onClick={() => onSave(form)} disabled={isSaving}>
            {isSaving ? <Loader2 size={15} className="animate-spin" style={{ marginRight: 6 }} /> : <Check size={15} style={{ marginRight: 6 }} />}
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

export function CulturalHighlights() {
  const { isContentEditor, loadFromStorage } = useAuthStore();
  const [items, setItems] = useState<CulturalItem[]>(DEFAULT_HIGHLIGHTS);
  const [editing, setEditing] = useState<CulturalItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadFromStorage();
    setMounted(true);
  }, [loadFromStorage]);

  useEffect(() => {
    fetchApi<{ success: boolean; data: CulturalItem[] }>('/api/settings/culture_highlights')
      .then((res) => { if (res.success && Array.isArray(res.data) && res.data.length > 0) setItems(res.data); })
      .catch(() => {});
  }, []);

  const handleSave = async (updated: CulturalItem) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const newItems = items.map((it) => (it.id === updated.id ? updated : it));
      await fetchApi('/api/admin/settings/culture_highlights', {
        method: 'PATCH',
        requireAuth: true,
        body: JSON.stringify({ value: newItems }),
      });
      setItems(newItems);
      setEditing(null);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Lỗi khi lưu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <section style={{ background: '#f5ede0', padding: '6rem 0' }}>
        <div className="container-wide">
          {/* Section header */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '4rem',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <div>
                <p style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: '#c9a96e',
                  marginBottom: '0.75rem',
                }}>
                  Văn Hóa Bana
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: '#1c1208',
                }}>
                  Những Sắc Màu
                  <em style={{ fontStyle: 'italic', color: '#2d5a27' }}> Di Sản</em>
                </h2>
              </div>
              <Link href="/van-hoa" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#2d5a27',
                textDecoration: 'none',
                transition: 'gap 0.3s',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.875rem'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = '0.5rem'; }}
              >
                Xem tất cả <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* Editorial grid — 1 large left + 3 small right, like MAISON reference */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '1rem',
          }}
            className="culture-grid"
          >
            {/* Large feature card — item 0 */}
            {items[0] && (
              <div
                className={`${mounted && isContentEditor ? 'admin-editable' : ''} culture-card-large`}
                style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => {}}
              >
                <Link href={items[0].link} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                    {items[0].image_url ? (
                      <img
                        src={items[0].image_url}
                        alt={items[0].title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                        onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                        onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2d5a27, #1a3a1a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>🧵</div>
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28, 18, 8, 0.85) 0%, rgba(28, 18, 8, 0.2) 50%, transparent)' }} />
                    <div style={{ position: 'absolute', inset: '1.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <p style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(253,246,236,0.6)', marginBottom: '0.5rem' }}>{items[0].count}</p>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: 'white', marginBottom: '0.5rem', lineHeight: 1.1 }}>{items[0].title}</h3>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(253,246,236,0.7)', maxWidth: '300px', lineHeight: 1.6 }}>{items[0].description}</p>
                    </div>
                    {/* Arrow on hover */}
                    <div style={{
                      position: 'absolute',
                      top: '1.5rem',
                      right: '1.5rem',
                      width: '2.5rem',
                      height: '2.5rem',
                      border: '1px solid rgba(253,246,236,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <ArrowUpRight size={16} color="white" />
                    </div>
                  </div>
                </Link>
                {mounted && isContentEditor && (
                  <button className="admin-edit-btn" onClick={() => setEditing(items[0]!)}>
                    <Pencil size={13} /> Sửa
                  </button>
                )}
              </div>
            )}

            {/* Small cards: items 1, 2, 3 */}
            <div className="culture-small-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {items.slice(1).map((item, i) => (
                <div
                  key={item.id}
                  className={mounted && isContentEditor ? 'admin-editable' : ''}
                  style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                >
                  <Link href={item.link} style={{ display: 'block', textDecoration: 'none' }}>
                    <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden' }}>
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                          onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)'; }}
                          onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = 'scale(1)'; }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: i === 0 ? 'linear-gradient(135deg, #4a2c0d, #8b5e3c)' : i === 1 ? 'linear-gradient(135deg, #1c1208, #4a2c0d)' : 'linear-gradient(135deg, #2d5a27, #8b5e3c)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem',
                        }}>
                          {['🥁', '🌿', '🏮'][i]}
                        </div>
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(28,18,8,0.8) 0%, rgba(28,18,8,0.1) 50%, transparent)' }} />
                      <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.5rem', right: '1.5rem' }}>
                        <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(253,246,236,0.55)', marginBottom: '4px' }}>{item.count}</p>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', fontWeight: 400, color: 'white', marginBottom: '2px' }}>{item.title}</h3>
                        <p style={{ fontSize: '0.8125rem', color: 'rgba(253,246,236,0.65)', lineHeight: 1.5 }}>{item.description}</p>
                      </div>
                      <div style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        width: '2rem', height: '2rem',
                        border: '1px solid rgba(253,246,236,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <ArrowUpRight size={13} color="white" />
                      </div>
                    </div>
                  </Link>
                  {mounted && isContentEditor && (
                    <button className="admin-edit-btn" onClick={() => setEditing(item)}>
                      <Pencil size={13} /> Sửa
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .culture-small-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
            .culture-small-grid > div > a > div {
              aspect-ratio: 3/4 !important;
            }
          }
          @media (min-width: 1024px) {
            .culture-grid {
              grid-template-columns: 5fr 7fr !important;
            }
            .culture-card-large > a > div {
              aspect-ratio: auto !important;
              height: 100% !important;
              min-height: 640px !important;
            }
            .culture-small-grid {
              grid-template-columns: 1fr !important;
            }
            .culture-small-grid > div > a > div {
              aspect-ratio: 3/2 !important;
            }
          }
        `}</style>
      </section>

      {editing && (
        <EditModal
          item={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
          isSaving={isSaving}
          saveError={saveError}
        />
      )}
    </>
  );
}
