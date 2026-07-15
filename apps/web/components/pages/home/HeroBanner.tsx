'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Loader2, X, Check, ImageIcon } from 'lucide-react';
import { useAuthStore } from '../../../src/store/useAuthStore';
import { fetchApi } from '../../../src/lib/api';
import styles from './HeroBanner.module.css';

export interface HeroBannerData {
  title: string;
  subtitle: string;
  description: string;
  image_url: string | null;
  cta_text: string;
  cta_link: string;
}

const DEFAULT_BANNER: HeroBannerData = {
  title: 'Chợ Phiên Ngọk Bay –',
  subtitle: 'Tinh Hoa Văn Hóa Bana',
  description: 'Khám phá và sở hữu những sản phẩm thủ công, đặc sản bản địa từ cộng đồng người Bana. Nông sản OCOP, thổ cẩm và nhạc cụ truyền thống từ vùng cao Quảng Ngãi.',
  image_url: '/hero-banner.png',
  cta_text: 'MUA NGAY',
  cta_link: '/products',
};

function AdminModal({
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
  const field = (k: keyof HeroBannerData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>✏️ Chỉnh sửa Banner</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>
        <div className={styles.modalBody}>
          <label className={styles.formField}>
            <span>Tiêu đề (dòng 1)</span>
            <input className="input" value={form.title} onChange={field('title')} />
          </label>
          <label className={styles.formField}>
            <span>Tiêu đề (dòng 2 — in đậm)</span>
            <input className="input" value={form.subtitle} onChange={field('subtitle')} />
          </label>
          <label className={styles.formField}>
            <span>Mô tả</span>
            <textarea className="input" rows={3} value={form.description} onChange={field('description')} style={{ fontFamily: 'inherit', resize: 'vertical' }} />
          </label>
          <label className={styles.formField}>
            <span>URL ảnh nền</span>
            <input className="input" type="url" value={form.image_url ?? ''} onChange={field('image_url')} placeholder="https://... hoặc /hero-banner.png" />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label className={styles.formField}>
              <span>Text nút CTA</span>
              <input className="input" value={form.cta_text} onChange={field('cta_text')} />
            </label>
            <label className={styles.formField}>
              <span>Link nút CTA</span>
              <input className="input" value={form.cta_link} onChange={field('cta_link')} />
            </label>
          </div>
        </div>
        {saveError && <p style={{ color: 'var(--color-error)', padding: '0 24px', fontSize: '0.875rem' }}>{saveError}</p>}
        <div className={styles.modalFooter}>
          <button className="btn" onClick={onClose} style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}>Hủy</button>
          <button className="btn btn-primary" onClick={() => onSave(form)} disabled={isSaving}>
            {isSaving ? <Loader2 size={15} className="animate-spin" style={{ marginRight: 6 }} /> : <Check size={15} style={{ marginRight: 6 }} />}
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

export function HeroBanner() {
  const { isContentEditor, loadFromStorage } = useAuthStore();
  const [banner, setBanner] = useState<HeroBannerData>(DEFAULT_BANNER);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    loadFromStorage();
    setMounted(true);
  }, [loadFromStorage]);

  useEffect(() => {
    fetchApi<{ success: boolean; data: HeroBannerData }>('/api/settings/hero_banner')
      .then((res) => { if (res.success && res.data) setBanner(res.data); })
      .catch(() => {});
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
      setBanner(newData);
      setIsEditing(false);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Lỗi khi lưu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <section
        className={`${styles.hero}${mounted && isContentEditor ? ' admin-editable' : ''}`}
        style={banner.image_url ? { backgroundImage: `url(${banner.image_url})` } : undefined}
      >
        {/* Dark gradient overlay */}
        <div className={styles.overlay_dark} />

        {/* Ethnic pattern overlay */}
        <div className={styles.patternOverlay} />

        <div className={`container ${styles.content}`}>
          {/* Left: Text */}
          <div className={styles.textBlock}>
            <div className={styles.badgeRow}>
              <span className={styles.badge}>🏪 Chợ Phiên Bản Địa</span>
            </div>
            <h1 className={styles.title}>
              {banner.title}<br />
              <span className={styles.titleHighlight}>{banner.subtitle}</span>
            </h1>
            <p className={styles.desc}>{banner.description}</p>
            <div className={styles.ctaRow}>
              <Link href={banner.cta_link} className={styles.ctaBtn}>
                {banner.cta_text} →
              </Link>
              <Link href="/van-hoa" className={styles.ctaBtnOutline}>
                Tìm hiểu văn hóa
              </Link>
            </div>

            {/* Quick stats */}
            <div className={styles.statsRow}>
              {[
                { num: '3+', label: 'Phiên chợ' },
                { num: '50+', label: 'Sản phẩm OCOP' },
                { num: '100%', label: 'Bản địa' },
              ].map((s) => (
                <div key={s.label} className={styles.statItem}>
                  <strong>{s.num}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin edit button */}
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

      {isEditing && (
        <AdminModal
          data={banner}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
          isSaving={isSaving}
          saveError={saveError}
        />
      )}
    </>
  );
}
