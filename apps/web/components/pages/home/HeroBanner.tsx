'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil, Loader2, X, Check } from 'lucide-react';
import { useAuthStore } from '../../../src/store/useAuthStore';
import { useAdminEdit } from '../../../src/hooks/useAdminEdit';
import { fetchApi } from '../../../src/lib/api';

export interface HeroBannerData {
  title: string;
  description: string;
  image_url: string | null;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  cta_secondary_link: string;
}

const DEFAULT_BANNER: HeroBannerData = {
  title: 'Mang Bản Sắc Vùng Cao Đến Tận Tay Bạn',
  description:
    'Nền tảng kết nối trực tiếp với các tiểu thương, nghệ nhân bản địa người Bana. Khám phá nông sản OCOP, thổ cẩm và thủ công mỹ nghệ từ vùng cao Quảng Ngãi.',
  image_url: null,
  cta_primary_text: 'Mua sắm ngay',
  cta_primary_link: '/products',
  cta_secondary_text: 'Khám phá văn hóa',
  cta_secondary_link: '/van-hoa',
};

// ----- Admin Editor Modal -----
function BannerEditorModal({
  data,
  onSave,
  onClose,
  isSaving,
  saveError,
}: {
  data: HeroBannerData;
  onSave: (d: HeroBannerData) => void;
  onClose: () => void;
  isSaving: boolean;
  saveError: string | null;
}) {
  const [form, setForm] = useState<HeroBannerData>(data);

  const set = (field: keyof HeroBannerData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 620 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.25rem' }}>Chỉnh sửa Banner</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <label>
            <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Tiêu đề lớn</span>
            <input id="banner-title" className="input" value={form.title} onChange={set('title')} />
          </label>
          <label>
            <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Mô tả</span>
            <textarea
              id="banner-description"
              className="input"
              rows={3}
              value={form.description}
              onChange={set('description')}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
            />
          </label>
          <label>
            <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>URL ảnh nền (https://...)</span>
            <input id="banner-image-url" className="input" type="url" value={form.image_url ?? ''} onChange={set('image_url')} placeholder="https://..." />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <label>
              <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Nút chính — Text</span>
              <input id="banner-cta-primary-text" className="input" value={form.cta_primary_text} onChange={set('cta_primary_text')} />
            </label>
            <label>
              <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Nút chính — Link</span>
              <input id="banner-cta-primary-link" className="input" value={form.cta_primary_link} onChange={set('cta_primary_link')} />
            </label>
            <label>
              <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Nút phụ — Text</span>
              <input id="banner-cta-secondary-text" className="input" value={form.cta_secondary_text} onChange={set('cta_secondary_text')} />
            </label>
            <label>
              <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Nút phụ — Link</span>
              <input id="banner-cta-secondary-link" className="input" value={form.cta_secondary_link} onChange={set('cta_secondary_link')} />
            </label>
          </div>
        </div>

        {saveError && (
          <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginTop: 'var(--space-3)' }}>{saveError}</p>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)', justifyContent: 'flex-end' }}>
          <button id="banner-cancel-btn" className="btn" onClick={onClose} style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}>
            Hủy
          </button>
          <button
            id="banner-save-btn"
            className="btn btn-primary"
            onClick={() => onSave(form)}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" style={{ marginRight: 6 }} /> : <Check size={16} style={{ marginRight: 6 }} />}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

// ----- Main HeroBanner -----
export function HeroBanner() {
  const { isContentEditor, loadFromStorage } = useAuthStore();
  const [bannerData, setBannerData] = useState<HeroBannerData>(DEFAULT_BANNER);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hydrate auth on mount
  useEffect(() => {
    loadFromStorage();
    setMounted(true);
  }, [loadFromStorage]);

  // Fetch banner data từ API
  useEffect(() => {
    fetchApi<{ success: boolean; data: HeroBannerData }>('/api/settings/hero_banner')
      .then((res) => {
        if (res.success && res.data) setBannerData(res.data);
      })
      .catch(() => {
        // Giữ DEFAULT_BANNER nếu API lỗi
      });
  }, []);

  const handleSave = async (newData: HeroBannerData) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await fetchApi('/api/admin/settings/hero_banner', {
        method: 'PATCH',
        requireAuth: true,
        body: JSON.stringify({ value: newData }),
      });
      setBannerData(newData);
      setIsEditing(false);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Lỗi khi lưu. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasImage = !!bannerData.image_url;

  return (
    <>
      <section
        className={isContentEditor && mounted ? 'admin-editable' : ''}
        style={{
          position: 'relative',
          minHeight: '560px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: hasImage
            ? undefined
            : 'linear-gradient(135deg, #7c2d12 0%, #c2410c 40%, #d97706 100%)',
        }}
      >
        {/* Background Image */}
        {hasImage && (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${bannerData.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.35) 60%, transparent 100%)',
              }}
            />
          </>
        )}

        {/* Decorative pattern overlay */}
        {!hasImage && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.08,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        )}

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: 'var(--space-16) var(--space-4)' }}>
          <div style={{ maxWidth: '640px' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 'var(--radius-full)',
              padding: 'var(--space-1) var(--space-4)',
              marginBottom: 'var(--space-6)',
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'white', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                🏔️ Chợ Phiên Ngok Bay · Quảng Ngãi
              </span>
            </div>

            {/* Title */}
            <h1
              className="animate-slide-up"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: 'white',
                marginBottom: 'var(--space-6)',
                letterSpacing: '-0.02em',
              }}
            >
              {bannerData.title}
            </h1>

            {/* Description */}
            <p
              className="animate-slide-up delay-100"
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.88)',
                marginBottom: 'var(--space-8)',
              }}
            >
              {bannerData.description}
            </p>

            {/* CTAs */}
            <div
              className="animate-slide-up delay-200"
              style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}
            >
              <Link
                href={bannerData.cta_primary_link}
                id="hero-cta-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  background: 'white',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  padding: 'var(--space-3) var(--space-8)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '1rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 30px rgba(0,0,0,0.25)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                }}
              >
                {bannerData.cta_primary_text} →
              </Link>
              <Link
                href={bannerData.cta_secondary_link}
                id="hero-cta-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  color: 'white',
                  fontWeight: 600,
                  padding: 'var(--space-3) var(--space-8)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '1rem',
                  backdropFilter: 'blur(8px)',
                  transition: 'background var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.22)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)';
                }}
              >
                {bannerData.cta_secondary_text}
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Edit Button */}
        {mounted && isContentEditor && (
          <button
            id="hero-admin-edit-btn"
            className="admin-edit-btn"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={14} /> Chỉnh sửa banner
          </button>
        )}
      </section>

      {/* Admin Editor Modal */}
      {isEditing && (
        <BannerEditorModal
          data={bannerData}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
          isSaving={isSaving}
          saveError={saveError}
        />
      )}
    </>
  );
}
