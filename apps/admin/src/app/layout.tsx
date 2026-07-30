'use client';

import React, { useEffect } from 'react';
import './globals.css';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useAdminAuthStore } from '../lib/authStore';
import { usePathname, useRouter } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadFromStorage, isContentEditor, user } = useAdminAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    // Nếu không ở trang đăng nhập và chưa có quyền thì chuyển hướng sang /login
    if (pathname !== '/login' && (!user || !isContentEditor)) {
      const timer = setTimeout(() => {
        const token = localStorage.getItem('admin_auth_token') || localStorage.getItem('auth_token');
        if (!token) {
          router.push('/login');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, isContentEditor, pathname, router]);

  const isLoginPage = pathname === '/login';

  return (
    <html lang="vi">
      <head>
        <title>Hệ thống Quản trị | Chợ Phiên Ngọk Bay</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {isLoginPage ? (
          <main className="min-h-screen bg-background flex items-center justify-center p-4">
            {children}
          </main>
        ) : (
          <div className="admin-layout">
            <Sidebar />
            <div className="admin-content">
              <Header />
              <main className="flex-1 p-6 bg-background overflow-y-auto">
                <div className="container">
                  {children}
                </div>
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
