export function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--space-8) 0',
      marginTop: 'auto'
    }}>
      <div className="container grid" style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-8)'
      }}>
        <div>
          <div className="font-bold text-lg text-primary mb-4" style={{ lineHeight: 1.2 }}>
            Ngok Bay Market
          </div>
          <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
            Nền tảng kết nối trực tiếp khách hàng với các tiểu thương, nghệ nhân bản địa người Bana tại các phiên chợ truyền thống.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-4">Liên kết</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li><a href="/" className="text-muted text-sm hover:text-primary">Trang chủ</a></li>
            <li><a href="/products" className="text-muted text-sm hover:text-primary">Sản phẩm OCOP</a></li>
            <li><a href="/artisans" className="text-muted text-sm hover:text-primary">Nghệ nhân</a></li>
            <li><a href="/about" className="text-muted text-sm hover:text-primary">Về chúng tôi</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Hỗ trợ</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li><a href="/faq" className="text-muted text-sm hover:text-primary">Câu hỏi thường gặp</a></li>
            <li><a href="/shipping" className="text-muted text-sm hover:text-primary">Chính sách vận chuyển</a></li>
            <li><a href="/privacy" className="text-muted text-sm hover:text-primary">Bảo mật thông tin</a></li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-4" style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'var(--space-4)',
        textAlign: 'center'
      }}>
        <p className="text-muted text-xs">
          &copy; {new Date().getFullYear()} Chợ Phiên Ngok Bay. Bản quyền được bảo hộ.
        </p>
      </div>
    </footer>
  );
}
