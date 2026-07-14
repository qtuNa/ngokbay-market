import { useState } from 'react';
import { fetchApi } from '../lib/api';

export type AuthState = 'idle' | 'sending' | 'waiting' | 'verifying' | 'authenticated';

export function useOtpAuth() {
  const [state, setState] = useState<AuthState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState('');

  const sendOtp = async (phoneNumber: string) => {
    setState('sending');
    setError(null);
    try {
      await fetchApi('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone: phoneNumber })
      });
      setPhone(phoneNumber);
      setState('waiting');
    } catch (err: any) {
      setError(err.message || 'Lỗi gửi OTP');
      setState('idle');
    }
  };

  const verifyOtp = async (code: string) => {
    setState('verifying');
    setError(null);
    try {
      const result = await fetchApi<{ success: boolean; token?: string; user?: any; message?: string }>('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, code })
      });
      
      if (result.success && result.token) {
        localStorage.setItem('auth_token', result.token);
        if (result.user) {
          localStorage.setItem('user_info', JSON.stringify(result.user));
        }
        setState('authenticated');
        // Trigger a custom event to notify other components (like Navbar) about login
        window.dispatchEvent(new Event('auth-change'));
        return true;
      } else {
        throw new Error(result.message || 'Xác thực thất bại');
      }
    } catch (err: any) {
      setError(err.message || 'Mã OTP không hợp lệ');
      setState('waiting');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setState('idle');
    setPhone('');
    window.dispatchEvent(new Event('auth-change'));
  };

  const reset = () => {
    setState('idle');
    setError(null);
    setPhone('');
  };

  return {
    state,
    error,
    phone,
    sendOtp,
    verifyOtp,
    logout,
    reset
  };
}
