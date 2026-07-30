// apps/admin/src/lib/authStore.ts
'use client';

import { create } from 'zustand';

export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN' | 'CONTENT_EDITOR';

export interface AuthUser {
  sub: string;
  phone: string;
  role: UserRole;
  name?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAdmin: boolean;
  isContentEditor: boolean;
  loadFromStorage: () => void;
  setToken: (token: string) => void;
  logout: () => void;
}

function parseJwtPayload(token: string): AuthUser | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const decoded = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
    if (decoded?.sub && decoded?.phone && decoded?.role) {
      return { sub: decoded.sub, phone: decoded.phone, role: decoded.role, name: decoded.name };
    }
    return null;
  } catch {
    return null;
  }
}

export const useAdminAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAdmin: false,
  isContentEditor: false,

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('admin_auth_token') || localStorage.getItem('auth_token');
    if (!token) {
      set({ user: null, isAdmin: false, isContentEditor: false });
      return;
    }
    const user = parseJwtPayload(token);
    const isAdmin = user?.role === 'ADMIN';
    const isContentEditor = user?.role === 'ADMIN' || user?.role === 'CONTENT_EDITOR';

    if (!isContentEditor) {
      // Nếu token không có quyền quản trị thì clear
      localStorage.removeItem('admin_auth_token');
      set({ user: null, isAdmin: false, isContentEditor: false });
      return;
    }

    set({ user, isAdmin, isContentEditor });
  },

  setToken: (token: string) => {
    if (typeof window === 'undefined') return;
    const user = parseJwtPayload(token);
    const isAdmin = user?.role === 'ADMIN';
    const isContentEditor = user?.role === 'ADMIN' || user?.role === 'CONTENT_EDITOR';

    if (isContentEditor) {
      localStorage.setItem('admin_auth_token', token);
      localStorage.setItem('auth_token', token);
      set({ user, isAdmin, isContentEditor });
    } else {
      throw new Error('Tài khoản của bạn không có quyền truy cập hệ thống quản trị.');
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_auth_token');
      localStorage.removeItem('auth_token');
    }
    set({ user: null, isAdmin: false, isContentEditor: false });
  },
}));
