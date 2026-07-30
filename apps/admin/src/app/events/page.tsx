'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  Search, 
  MapPin, 
  ExternalLink, 
  AlertCircle,
  X,
  Sparkles,
  Navigation
} from 'lucide-react';
import { fetchAdminApi } from '../../lib/api';

interface MarketEvent {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  opening_hours?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MarketEvent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [mapInputMode, setMapInputMode] = useState<'manual' | 'link'>('manual');
  const [mapLink, setMapLink] = useState('');
  const [resolvingLink, setResolvingLink] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    latitude?: string;
    longitude?: string;
    opening_hours?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    image_url?: string;
  }>({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    opening_hours: '',
    start_date: '',
    end_date: '',
    description: '',
    image_url: '',
  });

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const res: any = await fetchAdminApi(`/api/markets${query}`, { requireAuth: false });
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải danh sách lịch phiên');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setMapInputMode('manual');
    setMapLink('');
    setFormData({
      name: '',
      address: 'Xã Ba Thành, Huyện Ba Tơ, Tỉnh Quảng Ngãi',
      latitude: '',
      longitude: '',
      opening_hours: '06:00 - 17:00 (Thứ 7 & Chủ Nhật)',
      start_date: '',
      end_date: '',
      description: '',
      image_url: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ev: MarketEvent) => {
    setEditingEvent(ev);
    setMapInputMode('manual');
    setMapLink('');
    setFormData({
      name: ev.name || '',
      address: ev.address || '',
      latitude: ev.latitude ? String(ev.latitude) : '',
      longitude: ev.longitude ? String(ev.longitude) : '',
      opening_hours: ev.opening_hours || '',
      start_date: ev.start_date || '',
      end_date: ev.end_date || '',
      description: ev.description || '',
      image_url: ev.image_url || '',
    });
    setIsModalOpen(true);
  };

  const handleResolveMapLink = async () => {
    if (!mapLink.trim()) {
      alert('Vui lòng dán đường link chia sẻ vị trí bản đồ!');
      return;
    }
    setResolvingLink(true);
    try {
      const res: any = await fetchAdminApi('/api/admin/events/resolve-map-link', {
        method: 'POST',
        body: JSON.stringify({ url: mapLink.trim() }),
      });
      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          latitude: String(res.data.latitude),
          longitude: String(res.data.longitude),
        }));
        alert(`✅ Đã trích xuất tọa độ thành công!\nVĩ độ: ${res.data.latitude}\nKinh độ: ${res.data.longitude}`);
      } else {
        alert('❌ Không tìm thấy tọa độ từ link này. Bạn kiểm tra lại link nhé!');
      }
    } catch (err: any) {
      alert(`❌ Lỗi: ${err.message || 'Không thể trích xuất tọa độ.'}`);
    } finally {
      setResolvingLink(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload: any = {
        name: formData.name,
        address: formData.address,
        opening_hours: formData.opening_hours,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description,
        image_url: formData.image_url,
      };
      if (formData.latitude && formData.longitude && !isNaN(Number(formData.latitude)) && !isNaN(Number(formData.longitude))) {
        payload.latitude = Number(formData.latitude);
        payload.longitude = Number(formData.longitude);
      }

      if (editingEvent) {
        await fetchAdminApi(`/api/admin/events/${editingEvent.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchAdminApi('/api/admin/events', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setIsModalOpen(false);
      loadEvents();
    } catch (err: any) {
      alert(`Lỗi lưu phiên chợ: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa lịch phiên "${name}" không?`)) return;
    try {
      await fetchAdminApi(`/api/admin/events/${id}`, { method: 'DELETE' });
      loadEvents();
    } catch (err: any) {
      alert(`Xóa thất bại: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="text-secondary" size={24} />
            <span>Quản Lý Lịch Phiên Chợ & Địa Điểm</span>
          </h2>
          <p className="text-xs text-muted mt-1">
            Thiết lập thời gian và địa điểm tổ chức các phiên chợ vùng cao. Tích hợp tự động hóa định vị Geocoding bản đồ.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn btn-secondary shadow-lg shadow-secondary/25 shrink-0"
        >
          <Plus size={18} />
          <span>Tạo Phiên Chợ Mới</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="card p-4 flex items-center gap-3">
        <Search size={18} className="text-muted shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên chợ, địa điểm xã Ba Tơ, Minh Long..."
          className="input border-0 bg-transparent py-1 text-sm focus:shadow-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-muted hover:text-text">
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Events Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Tên phiên chợ</th>
              <th>Địa chỉ tổ chức</th>
              <th>Tọa độ GPS (Geocoding)</th>
              <th>Bản đồ chỉ đường</th>
              <th className="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                  <span>Đang tải danh sách lịch phiên...</span>
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-muted">
                  Chưa có lịch phiên chợ nào được tạo.
                </td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id}>
                  <td className="font-bold text-sm text-text">
                    <div className="flex items-center gap-3">
                      {ev.image_url && (
                        <img src={ev.image_url} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0 border border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      <div>
                        <div>{ev.name}</div>
                        {ev.opening_hours && <div className="text-[11px] text-secondary font-semibold mt-0.5">🕒 {ev.opening_hours}</div>}
                        {(ev.start_date || ev.end_date) && <div className="text-[11px] text-muted font-normal mt-0.5">📅 {ev.start_date} ➔ {ev.end_date}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <MapPin size={16} className="text-secondary shrink-0" />
                      <span>{ev.address}</span>
                    </div>
                  </td>
                  <td>
                    {ev.latitude && ev.longitude ? (
                      <span className="font-mono text-xs text-muted bg-background px-2 py-1 rounded border border-border">
                        {Number(ev.latitude).toFixed(5)}, {Number(ev.longitude).toFixed(5)}
                      </span>
                    ) : (
                      <span className="text-xs text-muted italic">Đang cập nhật...</span>
                    )}
                  </td>
                  <td>
                    {ev.latitude && ev.longitude && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${ev.latitude},${ev.longitude}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                      >
                        <Navigation size={12} />
                        <span>Google Maps</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(ev)}
                        className="btn btn-outline py-1 px-2.5 text-xs text-secondary hover:bg-secondary/10 border-secondary/20"
                        title="Chỉnh sửa"
                      >
                        <Edit3 size={14} />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id, ev.name)}
                        className="btn btn-outline py-1 px-2 text-xs text-error hover:bg-error/10 border-error/20"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-secondary" />
                <span>{editingEvent ? 'Chỉnh Sửa Lịch Phiên' : 'Tạo Lịch Phiên Chợ Mới'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-text p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Tên phiên chợ *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Phiên chợ vùng cao Ba Tơ - Tháng 8/2026"
                  className="input font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Địa chỉ chính xác *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ví dụ: Xã Ba Thành, Huyện Ba Tơ, Tỉnh Quảng Ngãi"
                  className="input font-medium"
                  required
                />
                <p className="text-[11px] text-muted mt-1.5 flex items-center gap-1">
                  💡 Hệ thống tự động dịch địa chỉ thành tọa độ (miễn phí qua OpenStreetMap). Bạn cũng có thể nhập tọa độ thủ công bên dưới nếu muốn ghim cực kỳ chính xác!
                </p>
              </div>

              <div className="p-3 bg-background rounded-xl border border-border flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-xs font-bold uppercase text-muted">📍 Chọn vị trí trên bản đồ</span>
                  <div className="flex items-center gap-1 bg-surface p-0.5 rounded-lg border border-border">
                    <button
                      type="button"
                      onClick={() => setMapInputMode('manual')}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-colors ${
                        mapInputMode === 'manual' ? 'bg-secondary text-white shadow-sm' : 'text-muted hover:text-text'
                      }`}
                    >
                      ✍️ Nhập tọa độ
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapInputMode('link')}
                      className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-colors ${
                        mapInputMode === 'link' ? 'bg-secondary text-white shadow-sm' : 'text-muted hover:text-text'
                      }`}
                    >
                      🔗 Dán Link chia sẻ
                    </button>
                  </div>
                </div>

                {mapInputMode === 'manual' ? (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-muted mb-1">Tọa độ Vĩ độ (Latitude)</label>
                      <input
                        type="text"
                        value={formData.latitude || ''}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        placeholder="VD: 14.77312"
                        className="input text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-muted mb-1">Tọa độ Kinh độ (Longitude)</label>
                      <input
                        type="text"
                        value={formData.longitude || ''}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        placeholder="VD: 108.73691"
                        className="input text-xs font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-1">
                    <label className="block text-[11px] font-bold text-muted">
                      💡 Mở Google Maps, tìm vị trí bạn muốn, bấm nút "Chia sẻ" (Share) ➔ chọn "Sao chép đường liên kết" (vd: https://maps.app.goo.gl/...) rồi dán vào đây:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={mapLink}
                        onChange={(e) => setMapLink(e.target.value)}
                        placeholder="Dán link (vd: https://maps.app.goo.gl/XfCjCanpAFe15Y9aA)..."
                        className="input text-xs font-mono flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleResolveMapLink}
                        disabled={resolvingLink || !mapLink.trim()}
                        className="btn btn-secondary text-xs px-3 py-2 shrink-0 shadow-sm"
                      >
                        {resolvingLink ? <Loader2 size={14} className="animate-spin" /> : <span>⚡ Trích xuất Tọa Độ</span>}
                      </button>
                    </div>
                    {formData.latitude && formData.longitude && (
                      <div className="p-2 bg-success/10 border border-success/20 rounded-lg text-success text-xs font-semibold flex items-center justify-between">
                        <span>✅ Tọa độ áp dụng: {Number(formData.latitude).toFixed(5)}, {Number(formData.longitude).toFixed(5)}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, latitude: '', longitude: '' })}
                          className="text-xs underline hover:text-error ml-2"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Thời gian mở cửa</label>
                <input
                  type="text"
                  value={formData.opening_hours || ''}
                  onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                  placeholder="Ví dụ: 06:00 - 17:00 (Thứ 7 & Chủ Nhật hàng tuần)"
                  className="input font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Thời gian bắt đầu sự kiện</label>
                  <input
                    type="text"
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    placeholder="VD: 15/08/2026 06:00"
                    className="input text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Thời gian kết thúc</label>
                  <input
                    type="text"
                    value={formData.end_date || ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    placeholder="VD: 17/08/2026 17:00"
                    className="input text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Hình ảnh đính kèm (URL)</label>
                <input
                  type="url"
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="VD: https://images.unsplash.com/photo-515151... hoặc link ảnh poster"
                  className="input text-sm font-mono"
                />
                {formData.image_url && (
                  <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-border relative bg-background flex items-center justify-center">
                    <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Mô tả chi tiết chợ phiên</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Giới thiệu về phiên chợ, các hoạt động văn hóa, đặc sản bày bán, gian hàng..."
                  rows={3}
                  className="input font-medium py-2 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-secondary shadow-lg shadow-secondary/25"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <span>{editingEvent ? 'Cập Nhật Phiên Chợ' : 'Tạo & Định Vị Ngay'}</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
