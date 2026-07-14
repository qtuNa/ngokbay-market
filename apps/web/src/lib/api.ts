const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

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
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: finalHeaders,
    ...restOptions,
  });
  
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.message || 'Có lỗi xảy ra khi kết nối máy chủ');
    (error as any).status = response.status;
    (error as any).data = data;
    throw error;
  }
  
  return data;
}
