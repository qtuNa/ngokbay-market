// apps/web/src/lib/api.ts
// Sử dụng /api/* prefix - Next.js rewrites sẽ proxy sang API server.
// Không cần NEXT_PUBLIC_API_URL trên client-side khi dùng rewrites.
// NEXT_PUBLIC_API_URL chỉ dùng trong rewrites config (server-side).

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * fetchApi — Gọi API endpoint.
 * - Trên browser: dùng relative path /api/... → Next.js proxy sang Fastify
 * - Không cần base URL trên client (tránh lộ cổng API)
 */
export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth = false, headers, ...restOptions } = options;

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const guestSessionId = typeof window !== 'undefined' ? localStorage.getItem('guest_session_id') : null;

  const finalHeaders = new Headers(headers);
  finalHeaders.set('Content-Type', 'application/json');

  if (requireAuth) {
    if (!token) {
      throw new Error('Bạn cần đăng nhập để thực hiện tính năng này');
    }
    finalHeaders.set('Authorization', `Bearer ${token}`);
  } else if (token) {
    // Luôn gửi token nếu có, ngay cả khi không bắt buộc
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  // Luôn gửi guest session ID để hỗ trợ giỏ hàng vãng lai
  if (guestSessionId) {
    finalHeaders.set('x-guest-session-id', guestSessionId);
  }

  // Dùng relative path — Next.js rewrites sẽ proxy /api/* → port 3002
  const response = await fetch(endpoint, {
    headers: finalHeaders,
    ...restOptions,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error((data as { message?: string }).message || 'Có lỗi xảy ra khi kết nối máy chủ');
    (error as Error & { status: number; data: unknown }).status = response.status;
    (error as Error & { status: number; data: unknown }).data = data;
    throw error;
  }

  return data as T;
}
