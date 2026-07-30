'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  Calendar, 
  MessageSquare, 
  ArrowUpRight, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  TrendingUp,
  MapPin,
  Sparkles
} from 'lucide-react';
import { fetchAdminApi } from '../lib/api';

interface StatsData {
  productsCount: number;
  ordersCount: number;
  eventsCount: number;
  contactsCount: number;
  recentOrders: any[];
  recentContacts: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    productsCount: 0,
    ordersCount: 0,
    eventsCount: 0,
    contactsCount: 0,
    recentOrders: [],
    recentContacts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Gọi song song các API
      const [productsRes, ordersRes, eventsRes, contactsRes]: any = await Promise.all([
        fetchAdminApi('/api/products', { requireAuth: false }).catch(() => ({ data: [] })),
        fetchAdminApi('/api/admin/orders?limit=5').catch(() => ({ data: [] })),
        fetchAdminApi('/api/markets', { requireAuth: false }).catch(() => ({ data: [] })),
        fetchAdminApi('/api/admin/contacts?limit=5').catch(() => ({ data: [] })),
      ]);

      const products = Array.isArray(productsRes.data) ? productsRes.data : [];
      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const events = Array.isArray(eventsRes.data) ? eventsRes.data : [];
      const contacts = Array.isArray(contactsRes.data) ? contactsRes.data : [];

      setStats({
        productsCount: productsRes.count || products.length,
        ordersCount: ordersRes.total || orders.length,
        eventsCount: eventsRes.count || events.length,
        contactsCount: contactsRes.total || contacts.length,
        recentOrders: orders.slice(0, 5),
        recentContacts: contacts.slice(0, 5),
      });
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const statCards = [
    {
      title: 'Sản phẩm OCOP & Bản địa',
      value: stats.productsCount,
      icon: Package,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      border: 'border-orange-500/20',
      link: '/products',
      linkText: 'Quản lý kho →',
    },
    {
      title: 'Tổng Đơn đặt hàng',
      value: stats.ordersCount,
      icon: ShoppingCart,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/20',
      link: '/orders',
      linkText: 'Duyệt đơn ngay →',
    },
    {
      title: 'Sự kiện Phiên chợ',
      value: stats.eventsCount,
      icon: Calendar,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/20',
      link: '/events',
      linkText: 'Cập nhật lịch →',
    },
    {
      title: 'Tin nhắn Liên hệ',
      value: stats.contactsCount,
      icon: MessageSquare,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/20',
      link: '/contacts',
      linkText: 'Phản hồi khách →',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-warning">Chờ xử lý</span>;
      case 'CONFIRMED':
        return <span className="badge badge-info">Đã xác nhận</span>;
      case 'SHIPPING':
        return <span className="badge badge-info">Đang giao hàng</span>;
      case 'COMPLETED':
        return <span className="badge badge-success">Hoàn thành</span>;
      case 'CANCELLED':
        return <span className="badge badge-error">Đã hủy</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="card bg-gradient-to-r from-primary/10 via-gold/10 to-secondary/10 border-primary/20 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        <div>
          <span className="badge bg-primary text-white mb-2 shadow-sm">
            <Sparkles size={12} className="mr-1 inline" /> Cổng điều hành Chợ Phiên
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">
            Chào mừng trở lại Trung tâm Quản trị!
          </h2>
          <p className="text-muted text-sm mt-1 max-w-xl">
            Hệ thống giám sát theo thời gian thực dòng chảy thương mại nông sản OCOP và thổ cẩm đồng bào Bana Quảng Ngãi.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Link href="/products" className="btn btn-primary shadow-lg shadow-primary/25">
            <PlusCircle size={16} />
            <span>Thêm Sản phẩm</span>
          </Link>
          <Link href="/events" className="btn btn-secondary">
            <MapPin size={16} />
            <span>Tạo Phiên chợ</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button onClick={loadDashboardData} className="btn btn-outline text-xs py-1">Thử lại</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`card border ${card.border} hover:shadow-lg transition-all`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-muted tracking-wider">{card.title}</span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold tracking-tight">
                  {loading ? <Loader2 size={24} className="animate-spin text-muted" /> : card.value}
                </span>
                <Link href={card.link} className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
                  <span>{card.linkText}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Orders & Recent Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              <h3 className="font-bold text-base">Đơn hàng Mới nhất</h3>
            </div>
            <Link href="/orders" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>Xem tất cả</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center text-muted"><Loader2 size={24} className="animate-spin" /></div>
          ) : stats.recentOrders.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm">Chưa có đơn hàng nào được đặt.</div>
          ) : (
            <div className="table-container shadow-none border-0">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order.id}>
                      <td className="font-mono text-xs font-bold text-primary">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td>
                        <div className="font-medium text-sm">{order.buyer_phone || order.phone || 'N/A'}</div>
                        <div className="text-[11px] text-muted truncate max-w-[150px]">{order.shipping_address || 'Tại phiên chợ'}</div>
                      </td>
                      <td className="font-bold text-sm">
                        {Number(order.total_amount || 0).toLocaleString('vi-VN')}đ
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-secondary" />
              <h3 className="font-bold text-base">Lời nhắn & Hợp tác mới</h3>
            </div>
            <Link href="/contacts" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
              <span>Xem tất cả</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center text-muted"><Loader2 size={24} className="animate-spin" /></div>
          ) : stats.recentContacts.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm">Chưa có tin nhắn liên hệ nào.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {stats.recentContacts.map((contact: any) => (
                <div key={contact.id} className="p-3.5 rounded-xl border border-border bg-background/50 hover:bg-background transition-colors flex items-start justify-between gap-4">
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{contact.name}</span>
                      <span className="text-xs text-muted">({contact.phone})</span>
                    </div>
                    <p className="text-xs text-muted mt-1 line-clamp-2 italic">
                      &quot;{contact.message}&quot;
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {contact.status === 'read' ? (
                      <span className="badge badge-success text-[10px]"><CheckCircle2 size={12} className="mr-1 inline" /> Đã đọc</span>
                    ) : (
                      <span className="badge badge-warning text-[10px]"><Clock size={12} className="mr-1 inline" /> Mới</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
