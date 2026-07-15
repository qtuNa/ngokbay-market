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
    id: 'ocop',
    title: 'Nông sản OCOP',
    description:
      'Mật ong rừng, măng khô, tiêu rừng — những đặc sản được chứng nhận OCOP 3–4 sao từ vùng núi Quảng Ngãi, thu hoạch tự nhiên không hóa chất.',
    image_url: null,
    link: '/products',
  },
  {
    id: 'tho-cam',
    title: 'Thổ cẩm Bana',
    description:
      'Từng sợi vải dệt tay mang theo tâm huyết của nghệ nhân người Bana. Hoa văn hình học truyền thống, màu sắc từ chất liệu thiên nhiên.',
    image_url: null,
    link: '/tho-cam',
  },
  {
    id: 'artisan',
    title: 'Nghệ nhân bản địa',
    description:
      'Gặp gỡ những bàn tay tạo ra điều kỳ diệu — các nghệ nhân người Bana, Hrê gìn giữ nghề truyền thống qua nhiều thế hệ tại vùng cao Sơn Hà, Ba Tơ.',
    image_url: null,
    link: '/van-hoa',
  },
];

// Màu gradient cho mỗi card khi không có ảnh
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)',
  'linear-gradient(135deg, #064e3b 0%, #0f766e 100%)',
  'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
];

const CARD_ICONS = ['🍯', '🧵', '🏔️'];

// ----- Item Editor Modal -----
function HighlightItemEditorModal({
  item,
  onSave,
  onClose,
  isSaving,
  saveError,
}: {
  item: CulturalItem;
  onSave: (d: CulturalItem) => void;
  onClose: () => void;
  isSaving: boolean;
  saveError: string | null;
}) {
  const [form, setForm] = useState<CulturalItem>(item);
  const set = (f: keyof CulturalItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.125rem' }}>Chỉnh sửa: {item.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <label>
            <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Tiêu đề</span>
            <input className="input" value={form.title} onChange={set('title')} />
          </label>
          <label>
            <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Mô tả</span>
            <textarea className="input" rows={4} value={form.description} onChange={set('description')} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
          </label>
          <label>
            <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>URL ảnh (https://...)</span>
            <input className="input" type="url" value={form.image_url ?? ''} onChange={set('image_url')} placeholder="https://..." />
          </label>
          <label>
            <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Link dẫn đến</span>
            <input className="input" value={form.link} onChange={set('link')} />
          </label>
        </div>
        {saveError && (
          <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginTop: 'var(--space-3)' }}>{saveError}</p>
        )}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={onClose} style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}>Hủy</button>
          <button className="btn btn-primary" onClick={() => onSave(form)} disabled={isSaving}>
            {isSaving ? <Loader2 size={16} className="animate-spin" style={{ marginRight: 6 }} /> : <Check size={16} style={{ marginRight: 6 }} />}
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

// ----- Single Cultural Card -----
function CulturalCard({
  item,
  index,
  isContentEditor,
  onEditSave,
  allItems,
}: {
  item: CulturalItem;
  index: number;
  isContentEditor: boolean;
  onEditSave: (updated: CulturalItem[]) => Promise<void>;
  allItems: CulturalItem[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const icon = CARD_ICONS[index % CARD_ICONS.length];

  const handleSave = async (updated: CulturalItem) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const newItems = allItems.map((it) => (it.id === updated.id ? updated : it));
      await onEditSave(newItems);
      setIsEditing(false);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Lỗi khi lưu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div
        className={`animate-slide-up delay-${(index + 1) * 100}${isContentEditor ? ' admin-editable' : ''}`}
        style={{
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
          cursor: 'default',
          background: 'var(--color-surface)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-xl)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)';
        }}
      >
        {/* Image / Gradient */}
        <div style={{ position: 'relative', height: '220px', background: gradient }}>
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '5rem',
              opacity: 0.6,
            }}>
              {icon}
            </div>
          )}
          {/* Admin edit btn on image */}
          {isContentEditor && (
            <button
              className="admin-edit-btn"
              onClick={() => setIsEditing(true)}
              style={{ top: 'var(--space-3)', right: 'var(--space-3)' }}
            >
              <Pencil size={13} /> Sửa
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--color-text)' }}>
            {item.title}
          </h3>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            {item.description}
          </p>
          <Link
            href={item.link}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              color: 'var(--color-primary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'gap var(--transition-fast)',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = 'var(--space-3)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.gap = 'var(--space-2)'; }}
          >
            Khám phá <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {isEditing && (
        <HighlightItemEditorModal
          item={item}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
          isSaving={isSaving}
          saveError={saveError}
        />
      )}
    </>
  );
}

// ----- Main CulturalHighlights -----
export function CulturalHighlights() {
  const { isContentEditor, loadFromStorage } = useAuthStore();
  const [items, setItems] = useState<CulturalItem[]>(DEFAULT_HIGHLIGHTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadFromStorage();
    setMounted(true);
  }, [loadFromStorage]);

  // Fetch từ API
  useEffect(() => {
    fetchApi<{ success: boolean; data: CulturalItem[] }>('/api/settings/culture_highlights')
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setItems(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveAll = async (newItems: CulturalItem[]) => {
    await fetchApi('/api/admin/settings/culture_highlights', {
      method: 'PATCH',
      requireAuth: true,
      body: JSON.stringify({ value: newItems }),
    });
    setItems(newItems);
  };

  return (
    <section
      style={{
        background: 'var(--color-cream)',
        padding: 'var(--space-16) 0',
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(90deg, var(--color-earth), var(--color-gold))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-3)',
          }}>
            Khám phá văn hóa bản địa
          </div>
          <h2 className="section-title" style={{ color: 'var(--color-text)' }}>
            Câu chuyện từ vùng cao
          </h2>
          <p className="section-subtitle mx-auto" style={{ textAlign: 'center' }}>
            Mỗi sản phẩm là một mảnh văn hóa, một câu chuyện được truyền qua nhiều thế hệ bởi đồng bào dân tộc thiểu số vùng núi Quảng Ngãi.
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
        }}>
          {items.map((item, i) => (
            <CulturalCard
              key={item.id}
              item={item}
              index={i}
              isContentEditor={mounted && isContentEditor}
              onEditSave={handleSaveAll}
              allItems={items}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
