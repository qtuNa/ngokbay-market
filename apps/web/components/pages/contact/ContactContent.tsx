'use client';

import { useState } from 'react';
import { Send, Check, Loader2, Phone, Mail, MapPin, Facebook } from 'lucide-react';

type ContactType = 'buyer' | 'investor' | 'feedback' | 'partner';

const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  buyer: '🛍️ Người mua / Khách hàng',
  investor: '💼 Nhà đầu tư',
  feedback: '💡 Góp ý / Báo lỗi',
  partner: '🤝 Đối tác / Hợp tác',
};

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Hotline',
    value: '0905 123 456',
    sub: 'Thứ 2 – Thứ 7, 8:00 – 17:00',
    color: 'var(--color-primary)',
    href: 'tel:0905123456',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'ngokbay.market@gmail.com',
    sub: 'Phản hồi trong 24 giờ làm việc',
    color: 'var(--color-secondary)',
    href: 'mailto:ngokbay.market@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Địa chỉ',
    value: 'Huyện Sơn Hà, Quảng Ngãi',
    sub: 'Vùng cao miền Trung Việt Nam',
    color: 'var(--color-earth)',
    href: 'https://maps.google.com/?q=Sơn+Hà,+Quảng+Ngãi',
  },
];

const INVEST_ITEMS = [
  { title: 'Phát triển hạ tầng', desc: 'Đầu tư vào không gian chợ, logistic và kho bãi cho vùng cao' },
  { title: 'Số hóa sản phẩm', desc: 'Hỗ trợ nghệ nhân đưa sản phẩm lên nền tảng thương mại điện tử' },
  { title: 'Bảo tồn văn hóa', desc: 'Tài trợ các chương trình gìn giữ nghề truyền thống và tri thức bản địa' },
];

export function ContactContent() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'buyer' as ContactType,
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const setField = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setStatus('sending');
    // Simulate submission (thực tế sẽ gọi API khi có endpoint)
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('sent');
  };

  return (
    <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-background)' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-10)',
          alignItems: 'start',
        }}>
          {/* Contact Form */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--space-6)', color: 'var(--color-text)' }}>
              Gửi tin nhắn cho chúng tôi
            </h2>

            {status === 'sent' ? (
              <div style={{
                background: 'rgba(34,197,94,0.08)',
                border: '1.5px solid var(--color-success)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-8)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✅</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
                  Cảm ơn bạn đã liên hệ!
                </h3>
                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong vòng 24 giờ làm việc.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => { setStatus('idle'); setForm({ name: '', phone: '', email: '', type: 'buyer', message: '' }); }}
                  style={{ marginTop: 'var(--space-6)', borderRadius: 'var(--radius-full)' }}
                >
                  Gửi tin khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <label>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
                      Họ và tên <span style={{ color: 'var(--color-error)' }}>*</span>
                    </span>
                    <input
                      id="contact-name"
                      className="input"
                      value={form.name}
                      onChange={setField('name')}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </label>
                  <label>
                    <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
                      Số điện thoại
                    </span>
                    <input
                      id="contact-phone"
                      className="input"
                      value={form.phone}
                      onChange={setField('phone')}
                      placeholder="0905 xxx xxx"
                      type="tel"
                    />
                  </label>
                </div>

                <label>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>Email</span>
                  <input
                    id="contact-email"
                    className="input"
                    value={form.email}
                    onChange={setField('email')}
                    placeholder="email@example.com"
                    type="email"
                  />
                </label>

                <label>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
                    Mục đích liên hệ
                  </span>
                  <select
                    id="contact-type"
                    className="input"
                    value={form.type}
                    onChange={setField('type')}
                    style={{ cursor: 'pointer' }}
                  >
                    {(Object.entries(CONTACT_TYPE_LABELS) as [ContactType, string][]).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-1)' }}>
                    Nội dung tin nhắn <span style={{ color: 'var(--color-error)' }}>*</span>
                  </span>
                  <textarea
                    id="contact-message"
                    className="input"
                    rows={5}
                    value={form.message}
                    onChange={setField('message')}
                    placeholder="Mô tả chi tiết câu hỏi, yêu cầu hoặc ý kiến đóng góp của bạn..."
                    required
                    style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </label>

                {status === 'error' && (
                  <p style={{ color: 'var(--color-error)', fontSize: '0.875rem' }}>
                    Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ trực tiếp qua hotline.
                  </p>
                )}

                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={status === 'sending'}
                  style={{ borderRadius: 'var(--radius-full)', padding: 'var(--space-3) var(--space-8)', fontSize: '1rem', alignSelf: 'flex-start' }}
                >
                  {status === 'sending' ? (
                    <><Loader2 size={18} className="animate-spin" style={{ marginRight: 8 }} /> Đang gửi...</>
                  ) : (
                    <><Send size={18} style={{ marginRight: 8 }} /> Gửi tin nhắn</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {/* Contact Info */}
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-5)' }}>Thông tin liên hệ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {CONTACT_INFO.map((info) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={info.label}
                      href={info.href}
                      target={info.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-4)',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--color-border)',
                        transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = info.color;
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 16px rgba(0,0,0,0.08)`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)';
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-md)',
                        background: `${info.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon size={22} style={{ color: info.color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 2 }}>{info.label}</div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{info.value}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{info.sub}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Investment Opportunities */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              color: 'white',
            }}>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
                💼 Cơ hội đầu tư
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
                Ngok Bay đang tìm kiếm các đối tác và nhà đầu tư có cùng tầm nhìn phát triển kinh tế bền vững cho vùng đồng bào dân tộc thiểu số.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {INVEST_ITEMS.map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)' }}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 'var(--space-4)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>
                📧 Liên hệ: <strong style={{ color: 'rgba(255,255,255,0.9)' }}>invest@ngokbay.market</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
