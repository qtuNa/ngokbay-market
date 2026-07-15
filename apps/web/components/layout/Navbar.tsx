'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '../../src/store/useCartStore';
import { OtpModal } from '../auth/OtpModal';
import { useAuthStore } from '../../src/store/useAuthStore';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/',           label: 'Trang chủ' },
  { href: '/products',   label: 'Sản phẩm nổi bật' },
  { href: '/tho-cam',    label: 'Thổ cẩm' },
  { href: '/van-hoa',    label: 'Văn hóa' },
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

  const cartItemCount = items.reduce((t, i) => t + i.quantity, 0);

  useEffect(() => {
    loadFromStorage();
    setMounted(true);
    const handle = () => loadFromStorage();
    window.addEventListener('auth-change', handle);
    return () => window.removeEventListener('auth-change', handle);
  }, [loadFromStorage]);

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.topBar}>
          <span className={styles.topBarText}>🏔️ Chợ Phiên Ngok Bay · Huyện Sơn Hà, Quảng Ngãi</span>
          <div className={styles.topBarRight}>
            <span>📞 0905 123 456</span>
            <span>✉️ ngokbay.market@gmail.com</span>
          </div>
        </div>

        <div className={styles.mainBar}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
            {/* Logo */}
            <Link href="/" className={styles.logo}>
              <div className={styles.logoIcon}>🏪</div>
              <div>
                <div className={styles.logoTitle}>CHỢ PHIÊN</div>
                <div className={styles.logoSubtitle}>NGỌK BAY</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className={styles.desktopNav}>
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {mounted && (
                user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isContentEditor && (
                      <span className={styles.adminBadge}>ADMIN</span>
                    )}
                    <button className={styles.logoutBtn} onClick={handleLogout}>Đăng xuất</button>
                  </div>
                ) : (
                  <button className={styles.loginBtn} onClick={() => setIsAuthModalOpen(true)}>
                    Đăng nhập
                  </button>
                )
              )}

              <button
                className={styles.cartBtn}
                onClick={() => useCartStore.getState().setIsOpen(true)}
                aria-label="Giỏ hàng"
              >
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className={styles.cartBadge}>{cartItemCount}</span>
                )}
              </button>

              <button
                className={styles.mobileMenuBtn}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Menu"
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileOpen && (
          <div className={styles.mobileNav}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? `${styles.mobileNavLink} ${styles.mobileNavLinkActive}` : styles.mobileNavLink}
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <OtpModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
