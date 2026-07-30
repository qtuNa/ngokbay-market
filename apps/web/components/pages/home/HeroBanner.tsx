'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Pencil, Loader2, X, Check } from 'lucide-react';
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
  title: 'Tinh Hoa',
  subtitle: 'Ngọk Bay',
  description: 'Vùng đất của người Bana giữa núi rừng Quảng Ngãi — nơi văn hóa ngàn năm còn lưu giữ trong từng thớ vải thổ cẩm, tiếng cồng chiêng và hạt gạo nếp thơm ngát.',
  image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=85',
  cta_text: 'Khám phá văn hóa',
  cta_link: '/van-hoa',
};

function AdminModal({
  data, onSave, onClose, isSaving, saveError,
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
            <span>Tiêu đề (dòng 2 — in vàng đồng)</span>
            <input className="input" value={form.subtitle} onChange={field('subtitle')} />
          </label>
          <label className={styles.formField}>
            <span>Mô tả</span>
            <textarea className="input" rows={3} value={form.description} onChange={field('description')} style={{ fontFamily: 'inherit', resize: 'vertical' }} />
          </label>
          <label className={styles.formField}>
            <span>URL ảnh nền</span>
            <input className="input" type="url" value={form.image_url ?? ''} onChange={field('image_url')} placeholder="https://... hoặc /hero-banner.jpg" />
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
      .then((res) => {
        if (res.success && res.data) {
          setBanner({ ...DEFAULT_BANNER, ...res.data });
        }
      })
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
        {/* Overlays */}
        <div className={styles.overlay_dark} />
        <div className={styles.overlay_bottom} />
        <div className={styles.patternOverlay} />

        {/* Decorative grid lines */}
        <div className={styles.gridLines}>
          {[0,1,2,3,4].map(i => <div key={i} className={styles.gridLine} />)}
        </div>
        <div className={styles.accentLine} />

        {/* Content */}
        <div className={`container-wide ${styles.content}`}>
          <div className={styles.grid}>
            {/* Left: Text block */}
            <div className={styles.textBlock}>
              <div className={styles.eyebrow}>
                <div className={styles.eyebrowLine} />
                <span className={styles.eyebrowText}>Chợ Phiên Bản Địa · Quảng Ngãi</span>
              </div>

              <h1 className={styles.title}>
                <span className={styles.titleNormal}>{banner.title}</span>
                <span className={styles.titleAccent}>{banner.subtitle}</span>
              </h1>

              <p className={styles.desc}>{banner.description}</p>

              <div className={styles.ctaRow}>
                <Link href={banner.cta_link} className={styles.ctaBtn}>
                  {banner.cta_text} <ArrowRight size={16} />
                </Link>
                <Link href="/products" className={styles.ctaBtnOutline}>
                  Mua sản phẩm
                </Link>
              </div>

              <div className={styles.statsRow}>
                {[
                  { num: '3+', label: 'Phiên chợ' },
                  { num: '50+', label: 'Sản phẩm OCOP' },
                  { num: '100%', label: 'Bản địa' },
                ].map((s) => (
                  <div key={s.label} className={styles.statItem}>
                    <span className={styles.statNum}>{s.num}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Heritage floating card */}
            <div className={styles.heritageCard}>
              <div className={styles.heritageCardInner}>
                <p className={styles.heritageLabel}>Di Sản Ngọk Bay</p>

                <div className={styles.heritageStat}>
                  <span className={styles.heritageStatNum}>Bana</span>
                  <span className={styles.heritageStatLabel}>Dân tộc chủ thể</span>
                </div>

                <div className={styles.heritageDivider} />

                <div className={styles.heritageStat}>
                  <span className={styles.heritageStatNum}>Ba Tơ</span>
                  <span className={styles.heritageStatLabel}>Huyện thuộc Quảng Ngãi</span>
                </div>

                <div className={styles.heritageDivider} />

                <div className={styles.heritageStat}>
                  <span className={styles.heritageStatNum}>Kon Tum</span>
                  <span className={styles.heritageStatLabel}>Tỉnh cũ trước năm 1975</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollDot} />
          <span className={styles.scrollText}>Khám phá</span>
        </div>

        {/* Bottom line */}
        <div className={styles.bottomLine} />

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
