'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Phone, KeyRound, ArrowRight, Loader2, Sparkles, Store } from 'lucide-react';
import { fetchAdminApi } from '../../lib/api';
import { useAdminAuthStore } from '../../lib/authStore';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setToken } = useAdminAuthStore();

  const [phone, setPhone] = useState('0900000000');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [devOtpMsg, setDevOtpMsg] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setError(null);
    setDevOtpMsg(null);

    try {
      const res: any = await fetchAdminApi('/api/auth/send-otp', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({ phone }),
      });

      if (res.success) {
        setStep('otp');
        if (res.dev_otp) {
          setOtp(res.dev_otp);
          setDevOtpMsg(`[Dev Mode] Mã OTP của bạn là: ${res.dev_otp}`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Gửi OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setError(null);

    try {
      const res: any = await fetchAdminApi('/api/auth/verify-otp', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({ phone, otp }),
      });

      if (res.success && res.token) {
        setToken(res.token);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Xác thực thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (targetPhone: string, roleName: string) => {
    setQuickLoading(targetPhone);
    setError(null);

    try {
      // 1. Gửi OTP
      const sendRes: any = await fetchAdminApi('/api/auth/send-otp', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({ phone: targetPhone }),
      });

      if (!sendRes.success || !sendRes.dev_otp) {
        throw new Error('Không lấy được mã dev_otp tự động.');
      }

      // 2. Xác thực OTP luôn
      const verifyRes: any = await fetchAdminApi('/api/auth/verify-otp', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({ phone: targetPhone, otp: sendRes.dev_otp }),
      });

      if (verifyRes.success && verifyRes.token) {
        setToken(verifyRes.token);
        router.push('/');
      }
    } catch (err: any) {
      setError(`Lỗi đăng nhập nhanh (${roleName}): ` + (err.message || 'Thất bại'));
    } finally {
      setQuickLoading(null);
    }
  };

  return (
    <div className="card w-full max-w-md p-8 shadow-xl border-border bg-surface relative overflow-hidden animate-fade-in">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-gold to-secondary" />

      <div className="text-center mb-8 mt-2">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Store size={32} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Cổng Quản Trị Ngọk Bay</h1>
        <p className="text-sm text-muted mt-1">Dành riêng cho Quản trị viên và Biên tập viên</p>
      </div>

      {error && (
        <div className="p-3 mb-6 bg-error/10 border border-error/20 rounded-lg text-error text-xs font-medium flex items-center gap-2">
          <Shield size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {devOtpMsg && (
        <div className="p-3 mb-6 bg-success/10 border border-success/20 rounded-lg text-success text-xs font-semibold flex items-center gap-2">
          <Sparkles size={16} className="shrink-0" />
          <span>{devOtpMsg}</span>
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-muted mb-2">
              Số điện thoại quản trị
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0900000000"
                className="input pl-10 py-3 text-sm font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !phone}
            className="btn btn-primary w-full py-3 text-sm mt-2 shadow-lg shadow-primary/25"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>Gửi mã xác thực</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4 animate-slide-up">
          <div>
            <label className="block text-xs font-semibold uppercase text-muted mb-2">
              Mã xác thực OTP (6 chữ số)
            </label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Nhập 6 chữ số"
                maxLength={6}
                className="input pl-10 py-3 text-sm font-bold tracking-widest text-center"
                required
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn btn-primary w-full py-3 text-sm mt-2 shadow-lg shadow-primary/25"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <span>Xác nhận & Đăng nhập</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => { setStep('phone'); setOtp(''); }}
            className="text-xs text-center text-muted hover:text-primary mt-2"
          >
            ← Đổi số điện thoại khác
          </button>
        </form>
      )}

      {/* Quick Login Section for Dev/Testing */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-[11px] font-bold text-muted uppercase tracking-wider text-center mb-3">
          ⚡ Đăng nhập nhanh kiểm thử (Dev Mode)
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleQuickLogin('0900000000', 'ADMIN')}
            disabled={quickLoading !== null}
            className="btn btn-outline py-2.5 px-3 text-xs flex items-center justify-center gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
          >
            {quickLoading === '0900000000' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Shield size={14} />
            )}
            <span className="font-bold">Quản Trị Viên</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('0900000001', 'CONTENT_EDITOR')}
            disabled={quickLoading !== null}
            className="btn btn-outline py-2.5 px-3 text-xs flex items-center justify-center gap-1.5 border-secondary/30 text-secondary hover:bg-secondary/5"
          >
            {quickLoading === '0900000001' ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            <span className="font-bold">Biên Tập Viên</span>
          </button>
        </div>
        <p className="text-[10px] text-muted text-center mt-2">
          Tự động gửi & xác thực OTP với tài khoản 0900000000 (Admin) / 0900000001 (Editor)
        </p>
      </div>
    </div>
  );
}
