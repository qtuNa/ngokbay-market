// apps/web/src/store/useAuthStore.ts
// Zustand store đọc JWT từ localStorage, parse role để kiểm tra quyền admin.
'use client';

import { create } from 'zustand';

export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN' | 'CONTENT_EDITOR';

export interface AuthUser {
  sub: string;
  phone: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  isAdmin: boolean;
  isContentEditor: boolean;
  loadFromStorage: () => void;
  logout: () => void;
}

/** Parse JWT payload (không verify — chỉ dùng để đọc role trên frontend) */
function parseJwtPayload(token: string): AuthUser | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const decoded = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
    if (decoded?.sub && decoded?.phone && decoded?.role) {
      return { sub: decoded.sub, phone: decoded.phone, role: decoded.role };
    }
    return null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAdmin: false,
  isContentEditor: false,

  loadFromStorage: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ user: null, isAdmin: false, isContentEditor: false });
      return;
    }
    const user = parseJwtPayload(token);
    set({
      user,
      isAdmin: user?.role === 'ADMIN',
      isContentEditor: user?.role === 'ADMIN' || user?.role === 'CONTENT_EDITOR',
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    }
    set({ user: null, isAdmin: false, isContentEditor: false });
  },
}));
