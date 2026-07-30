'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

export function HomeNewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Simple local "success" — can be wired to actual API later
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section style={{
      background: '#1a3a1a',
      padding: '5rem 0',
      borderTop: '1px solid rgba(201, 169, 110, 0.15)',
    }}>
      <div className="container-wide">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '2rem',
        }}>
          {/* Ornament */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '3rem', height: '1px', background: 'rgba(201,169,110,0.4)' }} />
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(201,169,110,0.7)', fontWeight: 700 }}>
              ✦ Cộng Đồng Ngọk Bay ✦
            </span>
            <div style={{ width: '3rem', height: '1px', background: 'rgba(201,169,110,0.4)' }} />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: 'white',
            maxWidth: '520px',
          }}>
            Đừng bỏ lỡ phiên chợ
            <em style={{ display: 'block', fontStyle: 'italic', color: '#c9a96e' }}>sắp tới</em>
          </h2>

          <p style={{
            fontSize: '1rem',
            lineHeight: 1.75,
            color: 'rgba(253,246,236,0.65)',
            maxWidth: '440px',
          }}>
            Đăng ký để nhận thông báo về lịch phiên chợ, sản phẩm mới và những câu chuyện văn hóa từ cộng đồng người Bana, Ngọk Bay.
          </p>

          {submitted ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 2rem',
              background: 'rgba(45,90,39,0.3)',
              border: '1px solid rgba(201,169,110,0.3)',
              color: '#c9a96e',
              fontSize: '0.9375rem',
              fontWeight: 600,
            }}>
              <CheckCircle size={18} />
              Cảm ơn bạn! Chúng tôi sẽ giữ liên lạc 🙏
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: 'flex',
              gap: '0',
              width: '100%',
              maxWidth: '480px',
            }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Địa chỉ email của bạn..."
                required
                style={{
                  flex: 1,
                  padding: '1rem 1.25rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(201,169,110,0.3)',
                  borderRight: 'none',
                  color: 'white',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,169,110,0.7)'; (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.12)'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(201,169,110,0.3)'; (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.08)'; }}
              />
              <button type="submit" style={{
                padding: '1rem 1.5rem',
                background: '#c9a96e',
                color: '#1c1208',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8125rem',
                letterSpacing: '0.1em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'inherit',
                transition: 'background 0.3s',
                whiteSpace: 'nowrap',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e8c98b'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#c9a96e'; }}
              >
                Đăng ký <ArrowRight size={14} />
              </button>
            </form>
          )}

          <p style={{ fontSize: '0.75rem', color: 'rgba(253,246,236,0.35)', letterSpacing: '0.04em' }}>
            Không spam. Hủy bất cứ lúc nào. 🌿
          </p>
        </div>
      </div>
    </section>
  );
}
