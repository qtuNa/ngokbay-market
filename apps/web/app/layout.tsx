import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { CartDrawer } from "../components/carts/cart-drawer";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Chợ Phiên Ngọk Bay — Tinh Hoa Văn Hóa Bana Quảng Ngãi",
  description: "Khám phá văn hóa, đặc sản và sản phẩm thủ công truyền thống của người Bana tại vùng cao Ngọk Bay, Quảng Ngãi (Kon Tum cũ). Kết nối trực tiếp với nghệ nhân bản địa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${playfairDisplay.variable}`}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <CartDrawer />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
