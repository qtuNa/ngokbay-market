'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Pencil, X, Check, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../src/store/useAuthStore';
import { fetchApi } from '../../../src/lib/api';

export interface CulturalItem {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string;
}

const DEFAULT_HIGHLIGHTS: CulturalItem[] = [
  {
    id: 'weaving',
    title: 'Nghệ nhân dệt thổ cẩm',
    description: 'Những người phụ nữ Bana gìn giữ nghề dệt thủ công qua nhiều thế hệ, tạo ra những tấm vải mang hoa văn độc đáo của văn hóa bản địa.',
    image_url: null,
    link: '/tho-cam',
  },
  {
    id: 'community',
    title: 'Cộng đồng & Lễ hội',
    description: 'Các phiên chợ truyền thống là nơi gặp gỡ, giao lưu văn hóa của đồng bào dân tộc Bana, Hrê tại vùng cao Quảng Ngãi.',
    image_url: null,
    link: '/van-hoa',
  },
];

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
  'linear-gradient(135deg, #14532d 0%, #166534 100%)',
];

const CARD_EMOJIS = ['🧵', '🥁'];

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
      <section style={{ background: '#fff9ed', padding: '64px 0' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '12px' }}>
              <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to right, transparent, #d97706)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', color: '#d97706', textTransform: 'uppercase' }}>✦ Văn hóa ✦</span>
              <div style={{ height: '2px', width: '60px', background: 'linear-gradient(to left, transparent, #d97706)' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#1c1008', letterSpacing: '-0.01em', marginBottom: '10px' }}>
              VĂN HÓA & CON NGƯỜI NGỌK BAY
            </h2>
            <p style={{ color: '#6b5c3e', fontSize: '0.9375rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
              Nhằm phá và tôi hiểu nông sản phẩm thổ cẩm, đặc sản địa tôi từng đồng người Bana. Đặc sản làng người địa tới Ngọk Bay.
            </p>
          </div>

          {/* Two-column card layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {items.map((item, i) => (
              <div
                key={item.id}
                className={mounted && isContentEditor ? 'admin-editable' : ''}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  border: '1px solid #f0e4cc',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.14)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                }}
              >
                {/* Card image */}
                <div style={{
                  height: '240px',
                  background: CARD_GRADIENTS[i % CARD_GRADIENTS.length],
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', opacity: 0.6 }}>
                      {CARD_EMOJIS[i % CARD_EMOJIS.length]}
                    </div>
                  )}
                  {/* Admin edit btn */}
                  {mounted && isContentEditor && (
                    <button className="admin-edit-btn" onClick={() => setEditing(item)}>
                      <Pencil size={13} /> Sửa
                    </button>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: '20px', background: 'white' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#1c1008', marginBottom: '10px' }}>{item.title}</h3>
                  <p style={{ color: '#6b5c3e', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '16px' }}>{item.description}</p>
                  <Link href={item.link} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#c2410c',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textDecoration: 'none',
                    transition: 'gap 0.15s',
                  }}>
                    Khám phá thêm <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
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
