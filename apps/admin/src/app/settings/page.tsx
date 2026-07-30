'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Settings, 
  Loader2, 
  AlertCircle, 
  Save, 
  CheckCircle2, 
  Image as ImageIcon, 
  Globe, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { fetchAdminApi } from '../../lib/api';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'hero_banner' | 'culture_highlights' | 'site_meta'>('hero_banner');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for each key
  const [heroBanner, setHeroBanner] = useState({
    title: 'Hương Vị Rừng Sâu — Hồn Thiêng Thổ Cẩm',
    subtitle: 'Khám phá không gian văn hóa chợ phiên truyền thống của đồng bào Bana và mua sắm trực tiếp đặc sản OCOP Quảng Ngãi chính gốc.',
    image_url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1600&auto=format&fit=crop',
    cta_text: 'Khám phá Chợ Phiên Ngay',
  });

  const [cultureHighlights, setCultureHighlights] = useState({
    title: 'Giao Thoa Văn Hóa & Nhịp Sống Bản Địa',
    description: 'Nơi quy tụ nghệ nhân dệt thổ cẩm truyền thống, cồng chiêng Bana và các sản vật nông nghiệp sạch từ vùng cao Ba Tơ, Minh Long.',
    image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?q=80&w=1000&auto=format&fit=crop',
    highlight_tag: 'Di Sản Phi Vật Thể',
  });

  const [siteMeta, setSiteMeta] = useState({
    site_name: 'Chợ Phiên Ngọk Bay',
    contact_phone: '0988 123 456',
    contact_email: 'lienhe@ngokbay.vn',
    address: 'Xã Ba Thành, Huyện Ba Tơ, Tỉnh Quảng Ngãi',
    copyright: '© 2026 Chợ Phiên Ngọk Bay - Dự án Phát triển Kinh tế Đồng bào Bana Quảng Ngãi.',
  });

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await fetchAdminApi('/api/settings', { requireAuth: false });
      if (res.success && res.data) {
        if (res.data.hero_banner) setHeroBanner((prev) => ({ ...prev, ...res.data.hero_banner }));
        if (res.data.culture_highlights) setCultureHighlights((prev) => ({ ...prev, ...res.data.culture_highlights }));
        if (res.data.site_meta) setSiteMeta((prev) => ({ ...prev, ...res.data.site_meta }));
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi tải cấu hình trang web');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    let valueToSave: any = {};
    if (activeTab === 'hero_banner') valueToSave = heroBanner;
    if (activeTab === 'culture_highlights') valueToSave = cultureHighlights;
    if (activeTab === 'site_meta') valueToSave = siteMeta;

    try {
      const res: any = await fetchAdminApi(`/api/admin/settings/${activeTab}`, {
        method: 'PATCH',
        body: JSON.stringify({ value: valueToSave }),
      });

      if (res.success) {
        setSuccessMsg('Cập nhật cấu hình thành công! Giao diện khách hàng đã được đồng bộ.');
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="text-primary" size={24} />
            <span>Cấu Hình Giao Diện & Nội Dung Web</span>
          </h2>
          <p className="text-xs text-muted mt-1">
            Quản lý trực tiếp hình ảnh Hero Banner, Câu chuyện văn hóa Bana và Thông tin liên hệ trên trang chủ cho khách.
          </p>
        </div>

        <button
          onClick={loadSettings}
          className="btn btn-outline text-xs py-2 px-3 self-start sm:self-auto"
        >
          <RefreshCw size={14} />
          <span>Tải lại dữ liệu gốc</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-success text-sm font-semibold flex items-center gap-2 animate-slide-up">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('hero_banner')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'hero_banner'
              ? 'border-primary text-primary bg-primary/10'
              : 'border-transparent text-muted hover:text-text'
          }`}
        >
          <ImageIcon size={16} />
          <span>🌄 Hero Banner Trang Chủ</span>
        </button>

        <button
          onClick={() => setActiveTab('culture_highlights')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'culture_highlights'
              ? 'border-secondary text-secondary bg-secondary/10'
              : 'border-transparent text-muted hover:text-text'
          }`}
        >
          <Sparkles size={16} />
          <span>🥁 Điểm Nhấn Văn Hóa Bana</span>
        </button>

        <button
          onClick={() => setActiveTab('site_meta')}
          className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'site_meta'
              ? 'border-purple-600 text-purple-600 bg-purple-500/10'
              : 'border-transparent text-muted hover:text-text'
          }`}
        >
          <Globe size={16} />
          <span>ℹ️ Thông Tin Liên Hệ & Footer</span>
        </button>
      </div>

      {/* Form Content */}
      {loading ? (
        <div className="card py-16 text-center text-muted">
          <Loader2 size={28} className="animate-spin mx-auto mb-3" />
          <span>Đang tải cấu hình hiện tại từ máy chủ...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="card p-6 flex flex-col gap-5 animate-slide-up">
          {activeTab === 'hero_banner' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Tiêu đề chính (Title)</label>
                <input
                  type="text"
                  value={heroBanner.title}
                  onChange={(e) => setHeroBanner({ ...heroBanner, title: e.target.value })}
                  className="input font-bold text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Đoạn giới thiệu ngắn (Subtitle)</label>
                <textarea
                  rows={3}
                  value={heroBanner.subtitle}
                  onChange={(e) => setHeroBanner({ ...heroBanner, subtitle: e.target.value })}
                  className="textarea text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Đường dẫn hình nền (Image URL)</label>
                <input
                  type="text"
                  value={heroBanner.image_url}
                  onChange={(e) => setHeroBanner({ ...heroBanner, image_url: e.target.value })}
                  className="input font-mono text-xs"
                />
                {heroBanner.image_url && (
                  <div className="mt-2 h-36 w-full max-w-md rounded-xl overflow-hidden border border-border shadow-inner">
                    <img src={heroBanner.image_url} alt="Preview Banner" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Chữ trên nút hành động (CTA Text)</label>
                <input
                  type="text"
                  value={heroBanner.cta_text}
                  onChange={(e) => setHeroBanner({ ...heroBanner, cta_text: e.target.value })}
                  className="input font-semibold text-sm max-w-xs"
                />
              </div>
            </>
          )}

          {activeTab === 'culture_highlights' && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Tên mục văn hóa</label>
                <input
                  type="text"
                  value={cultureHighlights.title}
                  onChange={(e) => setCultureHighlights({ ...cultureHighlights, title: e.target.value })}
                  className="input font-bold text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Thẻ nổi bật (Tag)</label>
                <input
                  type="text"
                  value={cultureHighlights.highlight_tag}
                  onChange={(e) => setCultureHighlights({ ...cultureHighlights, highlight_tag: e.target.value })}
                  className="input font-semibold text-sm max-w-xs text-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Mô tả văn hóa Bana & Thổ cẩm</label>
                <textarea
                  rows={4}
                  value={cultureHighlights.description}
                  onChange={(e) => setCultureHighlights({ ...cultureHighlights, description: e.target.value })}
                  className="textarea text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Hình ảnh minh họa</label>
                <input
                  type="text"
                  value={cultureHighlights.image_url}
                  onChange={(e) => setCultureHighlights({ ...cultureHighlights, image_url: e.target.value })}
                  className="input font-mono text-xs"
                />
                {cultureHighlights.image_url && (
                  <div className="mt-2 h-36 w-full max-w-md rounded-xl overflow-hidden border border-border shadow-inner">
                    <img src={cultureHighlights.image_url} alt="Preview Culture" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'site_meta' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Tên website / Dự án</label>
                  <input
                    type="text"
                    value={siteMeta.site_name}
                    onChange={(e) => setSiteMeta({ ...siteMeta, site_name: e.target.value })}
                    className="input font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Số điện thoại Hotline</label>
                  <input
                    type="text"
                    value={siteMeta.contact_phone}
                    onChange={(e) => setSiteMeta({ ...siteMeta, contact_phone: e.target.value })}
                    className="input font-semibold text-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Email liên hệ</label>
                  <input
                    type="email"
                    value={siteMeta.contact_email}
                    onChange={(e) => setSiteMeta({ ...siteMeta, contact_email: e.target.value })}
                    className="input font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Địa chỉ trụ sở / Chợ phiên</label>
                  <input
                    type="text"
                    value={siteMeta.address}
                    onChange={(e) => setSiteMeta({ ...siteMeta, address: e.target.value })}
                    className="input font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Dòng Bản quyền (Copyright)</label>
                <input
                  type="text"
                  value={siteMeta.copyright}
                  onChange={(e) => setSiteMeta({ ...siteMeta, copyright: e.target.value })}
                  className="input text-xs text-muted font-mono"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end pt-4 border-t border-border mt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary shadow-lg shadow-primary/25 px-6 py-2.5 text-sm"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  <span>Lưu Cấu Hình Này</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
