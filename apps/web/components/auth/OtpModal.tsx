'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, KeyRound, Loader2 } from 'lucide-react';
import { useOtpAuth } from '../../src/hooks/useOtpAuth';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function OtpModal({ isOpen, onClose, onSuccess }: OtpModalProps) {
  const { state, error, phone, sendOtp, verifyOtp, reset } = useOtpAuth();
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setPhoneInput('');
      setOtpInput('');
    }
  }, [isOpen, reset]);

  // Handle successful auth
  useEffect(() => {
    if (state === 'authenticated') {
      const timer = setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state, onClose, onSuccess]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 9) return;
    sendOtp(phoneInput);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpInput || otpInput.length !== 6) return;
    await verifyOtp(otpInput);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 'var(--space-4)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: 'var(--space-6)',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{
            width: '48px', height: '48px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            borderRadius: 'var(--radius-full)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto var(--space-4)',
            fontSize: '1.5rem', fontWeight: 'bold'
          }}>
            N
          </div>
          <h2 className="text-xl font-bold">Đăng nhập Chợ Phiên</h2>
          <p className="text-sm text-muted mt-2">
            Đăng nhập bằng số điện thoại qua Zalo OA
          </p>
        </div>

        {error && (
          <div style={{
            padding: 'var(--space-3)',
            backgroundColor: '#fee2e2',
            color: 'var(--color-error)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            marginBottom: 'var(--space-4)',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {state === 'idle' || state === 'sending' ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 600 }}>
                Số điện thoại của bạn
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="tel"
                  className="input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Ví dụ: 0912345678"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  disabled={state === 'sending'}
                  autoFocus
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={state === 'sending' || phoneInput.length < 9}
              style={{ padding: '0.75rem' }}
            >
              {state === 'sending' ? (
                <><Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} /> Đang gửi mã...</>
              ) : 'Nhận mã OTP qua Zalo'}
            </button>
          </form>
        ) : state === 'waiting' || state === 'verifying' ? (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
              <p className="text-sm text-muted">
                Mã OTP đã được gửi đến Zalo số <strong style={{ color: 'var(--color-text)' }}>{phone}</strong>
              </p>
              <button 
                type="button"
                onClick={reset}
                style={{ 
                  background: 'none', border: 'none', 
                  color: 'var(--color-primary)', 
                  fontSize: '0.75rem', marginTop: '8px',
                  cursor: 'pointer', textDecoration: 'underline'
                }}
              >
                Đổi số điện thoại khác
              </button>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontSize: '0.875rem', fontWeight: 600 }}>
                Nhập mã OTP (6 số)
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  className="input"
                  style={{ paddingLeft: '40px', letterSpacing: '4px', textAlign: 'center', fontSize: '1.25rem' }}
                  placeholder="------"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={state === 'verifying'}
                  autoFocus
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={state === 'verifying' || otpInput.length !== 6}
              style={{ padding: '0.75rem' }}
            >
              {state === 'verifying' ? (
                <><Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} /> Đang xác thực...</>
              ) : 'Xác nhận đăng nhập'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
            <div style={{ 
              width: '60px', height: '60px', 
              backgroundColor: '#dcfce7', color: 'var(--color-success)',
              borderRadius: 'var(--radius-full)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-4)',
              fontSize: '2rem'
            }}>
              ✓
            </div>
            <h3 className="text-lg font-bold">Đăng nhập thành công!</h3>
            <p className="text-sm text-muted mt-2">Chào mừng bạn trở lại Chợ Phiên.</p>
          </div>
        )}
      </div>
    </div>
  );
}
