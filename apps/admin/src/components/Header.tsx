'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Bell, RefreshCw } from 'lucide-react';
import { useAdminAuthStore } from '../lib/authStore';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, isContentEditor } = useAdminAuthStore();

  const getPageTitle = () => {
    if (pathname === '/') return 'Tổng quan Hệ thống';
    if (pathname?.startsWith('/products')) return 'Quản lý Sản phẩm & OCOP';
    if (pathname?.startsWith('/orders')) return 'Quản lý Đơn đặt hàng';
    if (pathname?.startsWith('/events')) return 'Quản lý Lịch phiên chợ';
    if (pathname?.startsWith('/contacts')) return 'Tin nhắn & Liên hệ Đối tác';
    if (pathname?.startsWith('/settings')) return 'Cấu hình Giao diện Trang chủ';
    return 'Admin Dashboard';
  };

  if (pathname === '/login') return null;

  return (
    <header className="admin-header">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold">{getPageTitle()}</h1>
        {isContentEditor && (
          <span className="badge badge-success flex items-center gap-1">
            <ShieldCheck size={14} />
            Đã kết nối máy chủ
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => window.location.reload()}
          title="Làm mới dữ liệu" 
          className="p-2 text-muted hover:text-primary rounded-lg hover:bg-background transition-colors flex items-center gap-2 text-xs font-semibold"
        >
          <RefreshCw size={16} />
          <span>Làm mới</span>
        </button>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
            {user?.phone ? user.phone.slice(-2) : 'AD'}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold">{user?.phone || 'Chưa đăng nhập'}</p>
            <p className="text-[10px] text-muted">{user?.role === 'ADMIN' ? 'Quản trị tối cao' : 'Biên tập viên'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
