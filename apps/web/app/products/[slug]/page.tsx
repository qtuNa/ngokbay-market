import React from 'react';
import { fetchApi } from '../../../src/lib/api';
import { ProductGallery } from '../../../components/pages/product-detail/ProductGallery';
import { ProductInfo } from '../../../components/pages/product-detail/ProductInfo';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Product } from '../../../components/products/ProductCard';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// Lấy thông tin chi tiết của 1 sản phẩm dựa trên slug/id
async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetchApi<{ success: boolean; data: Product }>(`/api/products/${slug}`, {
      // Revalidate every 60 seconds (hoặc tuỳ chiến lược Next.js cache)
      next: { revalidate: 60 } 
    });
    return response.success ? response.data : null;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

// Tạo metadata động (SEO)
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  
  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm | Chợ Phiên Ngok Bay',
    };
  }

  return {
    title: `${product.name} | Chợ Phiên Ngok Bay`,
    description: (product as any).description || `Mua ${product.name} chính gốc từ bản làng.`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    return (
      <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', textAlign: 'center' }}>
        <h1 className="text-xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <p className="text-muted mb-6">Sản phẩm này không tồn tại hoặc đã bị gỡ.</p>
        <Link href="/products" className="btn btn-primary">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // Chuẩn bị dữ liệu hình ảnh (Mock: lấy image_url hiện tại làm ảnh chính)
  const images = product.image_url ? [
    { id: '1', url: product.image_url, isPrimary: true }
  ] : [];

  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
      {/* Breadcrumb / Back button */}
      <Link href="/products" className="text-muted hover:text-primary flex items-center gap-2 mb-6 inline-flex text-sm">
        <ArrowLeft size={16} /> Quay lại danh sách
      </Link>

      <div className="grid" style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--space-8)'
      }}>
        {/* Cột trái: Hình ảnh */}
        <div>
          <ProductGallery images={images} productName={product.name} />
        </div>

        {/* Cột phải: Thông tin */}
        <div>
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}
