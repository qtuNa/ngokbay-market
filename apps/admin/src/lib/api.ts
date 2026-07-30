// apps/admin/src/lib/api.ts
// Giao tiếp với API server (@repo/api) qua Next.js rewrites hoặc trực tiếp qua 127.0.0.1 cho SSR.

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function fetchAdminApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth = true, headers, ...restOptions } = options;

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_auth_token') || localStorage.getItem('auth_token') : null;

  const finalHeaders = new Headers(headers);
  if (restOptions.body && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json');
  }

  if (requireAuth) {
    if (!token) {
      throw new Error('Bạn cần đăng nhập bằng tài khoản Admin để truy cập');
    }
    finalHeaders.set('Authorization', `Bearer ${token}`);
  } else if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  let url = endpoint;
  if (typeof window === 'undefined' && endpoint.startsWith('/')) {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002').replace('localhost', '127.0.0.1');
    url = `${baseUrl}${endpoint}`;
  }

  const response = await fetch(url, {
    headers: finalHeaders,
    ...restOptions,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error((data as { message?: string }).message || 'Có lỗi xảy ra từ máy chủ API');
    (error as Error & { status: number; data: unknown }).status = response.status;
    (error as Error & { status: number; data: unknown }).data = data;
    throw error;
  }

  return data as T;
}
