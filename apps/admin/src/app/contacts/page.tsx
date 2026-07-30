'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  MessageSquare, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Filter, 
  Phone, 
  Mail, 
  UserCheck, 
  Tag
} from 'lucide-react';
import { fetchAdminApi } from '../../lib/api';

interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type?: string;
  message: string;
  status: 'unread' | 'read' | 'processed';
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'unread', label: '🔴 Chưa đọc / Mới' },
  { value: 'read', label: '🟢 Đã xem' },
  { value: 'processed', label: '✅ Đã phản hồi / Xong' },
];

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = statusFilter !== 'ALL' ? `?status=${encodeURIComponent(statusFilter)}` : '';
      const res: any = await fetchAdminApi(`/api/admin/contacts${query}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải danh sách tin nhắn');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await fetchAdminApi(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      loadMessages();
    } catch (err: any) {
      alert(`Lỗi cập nhật tin nhắn: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa lời nhắn từ "${name}" không?`)) return;
    try {
      await fetchAdminApi(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      loadMessages();
    } catch (err: any) {
      alert(`Xóa thất bại: ${err.message}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <span className="badge badge-error"><Clock size={12} className="mr-1 inline" /> Chưa đọc</span>;
      case 'read':
        return <span className="badge badge-info"><CheckCircle2 size={12} className="mr-1 inline" /> Đã xem</span>;
      case 'processed':
        return <span className="badge badge-success"><UserCheck size={12} className="mr-1 inline" /> Đã phản hồi</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'seller':
        return <span className="text-[11px] font-semibold text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded">🧑‍🌾 Đăng ký bán hàng</span>;
      case 'investor':
        return <span className="text-[11px] font-semibold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded">🤝 Hợp tác kinh doanh</span>;
      default:
        return <span className="text-[11px] font-medium text-muted bg-background px-2 py-0.5 rounded border border-border">💬 Góp ý chung</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="text-purple-600 dark:text-purple-400" size={24} />
            <span>Hộp Thư Liên Hệ & Đối Tác</span>
          </h2>
          <p className="text-xs text-muted mt-1">
            Tiếp nhận lời nhắn, yêu cầu tham gia gian hàng từ bà con và đề xuất hợp tác đầu tư.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 card p-2 bg-background border-border shrink-0">
          <Filter size={16} className="text-muted ml-1" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select border-0 bg-transparent py-1 text-xs font-semibold focus:shadow-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Messages Grid */}
      {loading ? (
        <div className="card py-16 text-center text-muted">
          <Loader2 size={28} className="animate-spin mx-auto mb-3" />
          <span>Đang tải danh sách hộp thư...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="card py-16 text-center text-muted text-sm">
          Hộp thư hiện đang trống. Chưa có tin nhắn nào phù hợp với bộ lọc.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className="card p-5 hover:shadow-md transition-shadow border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1 overflow-hidden">
                <div className="flex flex-wrap items-center gap-2.5 mb-2">
                  <span className="font-bold text-base">{msg.name}</span>
                  {getTypeBadge(msg.type)}
                  {getStatusBadge(msg.status)}
                  <span className="text-xs text-muted font-mono ml-auto md:ml-0">
                    {new Date(msg.created_at || Date.now()).toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted mb-3">
                  <span className="flex items-center gap-1 font-semibold text-text">
                    <Phone size={13} className="text-primary" /> {msg.phone}
                  </span>
                  {msg.email && (
                    <span className="flex items-center gap-1">
                      <Mail size={13} className="text-muted" /> {msg.email}
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-background/80 border border-border/60 text-sm font-normal text-text/90 italic leading-relaxed">
                  &quot;{msg.message}&quot;
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border">
                {updatingId === msg.id ? (
                  <div className="inline-flex items-center gap-1 text-xs text-muted px-3 py-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Đang lưu...</span>
                  </div>
                ) : (
                  <>
                    {msg.status !== 'read' && msg.status !== 'processed' && (
                      <button
                        onClick={() => handleUpdateStatus(msg.id, 'read')}
                        className="btn btn-outline text-xs py-1.5 px-3 border-blue-500/20 text-blue-600 hover:bg-blue-500/10 w-full"
                      >
                        👁️ Đánh dấu đã đọc
                      </button>
                    )}
                    {msg.status !== 'processed' && (
                      <button
                        onClick={() => handleUpdateStatus(msg.id, 'processed')}
                        className="btn btn-outline text-xs py-1.5 px-3 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10 w-full"
                      >
                        ✅ Đã phản hồi xong
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id, msg.name)}
                      className="btn btn-outline text-xs py-1.5 px-3 text-error hover:bg-error/10 border-error/20 w-full flex items-center justify-center gap-1"
                      title="Xóa lời nhắn"
                    >
                      <Trash2 size={13} />
                      <span>Xóa</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
