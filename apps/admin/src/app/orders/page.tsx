'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  ShoppingCart, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  XCircle,
  Filter,
  RefreshCw,
  Phone,
  MapPin
} from 'lucide-react';
import { fetchAdminApi } from '../../lib/api';

interface Order {
  id: string;
  buyer_phone?: string;
  phone?: string;
  total_amount: number;
  status: string;
  shipping_address?: string;
  created_at: string;
  items_count?: number;
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: '⏳ Chờ xử lý' },
  { value: 'PROCESSING', label: '⚙️ Đang xử lý' },
  { value: 'SHIPPING', label: '🚚 Đang giao hàng' },
  { value: 'DELIVERED', label: '✅ Đã giao hàng' },
  { value: 'CANCELLED', label: '❌ Đã hủy' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = statusFilter !== 'ALL' ? `?status=${encodeURIComponent(statusFilter)}` : '';
      const res: any = await fetchAdminApi(`/api/admin/orders${query}`);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await fetchAdminApi(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      loadOrders();
    } catch (err: any) {
      alert(`Lỗi cập nhật trạng thái: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-warning"><Clock size={12} className="mr-1 inline" /> Chờ xử lý</span>;
      case 'PROCESSING':
        return <span className="badge badge-info"><RefreshCw size={12} className="mr-1 inline animate-spin" /> Đang chuẩn bị</span>;
      case 'SHIPPING':
        return <span className="badge badge-info"><Truck size={12} className="mr-1 inline" /> Đang giao</span>;
      case 'DELIVERED':
      case 'COMPLETED':
        return <span className="badge badge-success"><PackageCheck size={12} className="mr-1 inline" /> Đã giao</span>;
      case 'CANCELLED':
        return <span className="badge badge-error"><XCircle size={12} className="mr-1 inline" /> Đã hủy</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="text-primary" size={24} />
            <span>Quản Lý Đơn Đặt Hàng</span>
          </h2>
          <p className="text-xs text-muted mt-1">
            Theo dõi, xử lý và cập nhật tiến độ giao nhận nông sản cho khách mua tại chợ phiên.
          </p>
        </div>

        {/* Status Filter */}
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

      {/* Orders Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng & Liên hệ</th>
              <th>Địa chỉ giao hàng</th>
              <th>Tổng thanh toán</th>
              <th>Trạng thái hiện tại</th>
              <th className="text-right">Chuyển trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                  <span>Đang tải danh sách đơn hàng...</span>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted">
                  Không tìm thấy đơn đặt hàng nào trong danh mục này.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                      #{o.id.slice(0, 8)}
                    </span>
                    <div className="text-[10px] text-muted mt-1">
                      {new Date(o.created_at || Date.now()).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      <Phone size={14} className="text-muted" />
                      <span>{o.buyer_phone || o.phone || 'Không có SĐT'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-xs text-muted flex items-center gap-1 max-w-[220px]">
                      <MapPin size={14} className="text-muted shrink-0" />
                      <span className="truncate">{o.shipping_address || 'Nhận trực tiếp tại phiên chợ'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="font-extrabold text-sm text-primary">
                      {Number(o.total_amount || 0).toLocaleString('vi-VN')}đ
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(o.status)}
                  </td>
                  <td className="text-right">
                    {updatingId === o.id ? (
                      <div className="inline-flex items-center gap-1 text-xs text-muted">
                        <Loader2 size={14} className="animate-spin" />
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                        className="select py-1 px-2 text-xs font-semibold border-primary/20 bg-primary/5 text-primary rounded-lg max-w-[140px] inline-block"
                      >
                        <option value="PENDING">⏳ Chờ xử lý</option>
                        <option value="PROCESSING">⚙️ Đang xử lý</option>
                        <option value="SHIPPING">🚚 Đang giao</option>
                        <option value="DELIVERED">✅ Đã giao hàng</option>
                        <option value="CANCELLED">❌ Hủy đơn</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
