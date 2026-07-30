'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  Store,
  ExternalLink
} from 'lucide-react';
import { useAdminAuthStore } from '../lib/authStore';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAdminAuthStore();

  const navItems = [
    { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
    { name: 'Sản phẩm', href: '/products', icon: Package },
    { name: 'Đơn hàng', href: '/orders', icon: ShoppingCart },
    { name: 'Phiên chợ', href: '/events', icon: Calendar },
    { name: 'Liên hệ', href: '/contacts', icon: MessageSquare },
    { name: 'Cấu hình Web', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-lg">
          <Store size={22} />
        </div>
        <div>
          <h1 className="font-bold text-base leading-tight">NGỌK BAY</h1>
          <span className="text-xs text-primary font-semibold tracking-wider">ADMIN PORTAL</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto">
        <div className="px-6 mb-2 text-xs font-semibold text-muted tracking-wider uppercase">
          Menu Quản Trị
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="mt-8 px-6 mb-2 text-xs font-semibold text-muted tracking-wider uppercase">
          Khách hàng
        </div>
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link text-muted hover:text-primary"
        >
          <ExternalLink size={18} />
          <span>Xem Website</span>
        </a>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-border bg-background/50">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.phone}</p>
              <span className="badge badge-info mt-1 text-[10px]">
                {user.role === 'ADMIN' ? 'Quản trị viên' : 'Biên tập viên'}
              </span>
            </div>
            <button
              onClick={logout}
              title="Đăng xuất"
              className="p-2 text-muted hover:text-error rounded-lg hover:bg-error/10 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary w-full text-xs">
            Đăng nhập
          </Link>
        )}
      </div>
    </aside>
  );
};
