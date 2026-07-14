import Link from 'next/link';
import { ShoppingCart, Map, Package, User, LogOut } from 'lucide-react';
import { useCartStore } from '../../src/store/useCartStore';
import { useState, useEffect } from 'react';
import { OtpModal } from '../auth/OtpModal';

export function Navbar() {
  const { items } = useCartStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Check auth state on mount and when auth changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('auth_token'));
    };
    checkAuth();
    
    window.addEventListener('auth-change', checkAuth);
    return () => window.removeEventListener('auth-change', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('auth-change'));
  };

  return (
    <>
      <header style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="container flex items-center justify-between" style={{ height: '70px' }}>
          <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              N
            </div>
            <div>
              <div className="font-bold text-lg text-primary" style={{ lineHeight: 1.2 }}>Ngok Bay</div>
              <div className="text-xs text-muted">Chợ phiên bản địa</div>
            </div>
          </Link>

          <nav className="flex items-center gap-4" style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/products" className="flex items-center gap-2 text-text" style={{ fontWeight: 500 }}>
              <Package size={20} /> Sản phẩm
            </Link>
            <Link href="/" className="flex items-center gap-2 text-text" style={{ fontWeight: 500 }}>
              <Map size={20} /> Bản đồ chợ
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2" 
                title="Đăng xuất"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text)', padding: 'var(--space-2)'
                }}
              >
                <LogOut size={22} />
              </button>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2" 
                title="Đăng nhập"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-text)', padding: 'var(--space-2)'
                }}
              >
                <User size={24} />
              </button>
            )}

            <button 
              onClick={() => useCartStore.getState().setIsOpen(true)}
              style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text)',
              padding: 'var(--space-2)'
            }}>
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'var(--color-error)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px'
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <OtpModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}
