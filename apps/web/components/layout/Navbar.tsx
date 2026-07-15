'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '../../src/store/useCartStore';
import { useState, useEffect } from 'react';
import { OtpModal } from '../auth/OtpModal';
import { useAuthStore } from '../../src/store/useAuthStore';

const NAV_LINKS = [
  { href: '/products',   label: 'Sản phẩm' },
  { href: '/van-hoa',    label: 'Văn hóa' },
  { href: '/tho-cam',    label: 'Thổ cẩm' },
  { href: '/lich-phien', label: 'Lịch phiên' },
  { href: '/lien-he',    label: 'Liên hệ' },
];

export function Navbar() {
  const pathname = usePathname();
  const { items } = useCartStore();
  const { user, isContentEditor, loadFromStorage, logout } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    loadFromStorage();
    setMounted(true);

    const handleAuthChange = () => loadFromStorage();
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [loadFromStorage]);

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <>
      <header style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          {/* Logo */}
          <Link href="/" id="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-gold) 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              flexShrink: 0,
            }}>
              N
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.0625rem', lineHeight: 1.1, color: 'var(--color-text)' }}>Ngok Bay</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', letterSpacing: '0.03em' }}>Chợ phiên bản địa</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
            className="desktop-nav">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`nav-${link.href.replace('/', '')}`}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9375rem',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                    background: isActive ? 'rgba(234,88,12,0.08)' : 'transparent',
                    transition: 'background var(--transition-fast), color var(--transition-fast)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {/* Auth */}
            {mounted && (
              user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  {isContentEditor && (
                    <span style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(234,88,12,0.12)',
                      color: 'var(--color-primary)',
                      letterSpacing: '0.05em',
                    }}>
                      ADMIN
                    </span>
                  )}
                  <button
                    id="nav-logout-btn"
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-full)',
                      padding: 'var(--space-1) var(--space-3)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      transition: 'border-color var(--transition-fast), color var(--transition-fast)',
                    }}
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <button
                  id="nav-login-btn"
                  onClick={() => setIsAuthModalOpen(true)}
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                >
                  Đăng nhập
                </button>
              )
            )}

            {/* Cart */}
            <button
              id="nav-cart-btn"
              onClick={() => useCartStore.getState().setIsOpen(true)}
              style={{
                position: 'relative',
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-full)',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text)',
                transition: 'border-color var(--transition-fast)',
              }}
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--color-error)',
                  color: 'white',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              id="nav-mobile-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                width: '40px',
                height: '40px',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-text)',
              }}
              className="mobile-menu-btn"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMobileOpen && (
          <div style={{
            borderTop: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
            className="mobile-nav"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 500,
                  color: pathname === link.href ? 'var(--color-primary)' : 'var(--color-text)',
                  background: pathname === link.href ? 'rgba(234,88,12,0.08)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      <OtpModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
