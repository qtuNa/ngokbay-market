'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Loader2, 
  Search, 
  Star, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { fetchAdminApi } from '../../lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  ocop_rating?: number;
  image_url?: string;
  description?: string;
  status: 'draft' | 'published';
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Modal Thêm / Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 100000,
    stock: 10,
    ocop_rating: 4,
    image_url: 'https://images.unsplash.com/photo-1610486044703-a4473855a90d?q=80&w=600&auto=format&fit=crop',
    description: '',
    status: 'published' as 'draft' | 'published',
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await fetchAdminApi(`/api/products${search ? `?search=${encodeURIComponent(search)}` : ''}`, {
        requireAuth: false,
      });
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 150000,
      stock: 20,
      ocop_rating: 4,
      image_url: 'https://images.unsplash.com/photo-1610486044703-a4473855a90d?q=80&w=600&auto=format&fit=crop',
      description: 'Sản phẩm đặc sản vùng cao Ngọk Bay, chất lượng tuyệt hảo.',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name || '',
      price: Number(p.price || 0),
      stock: Number(p.stock || 0),
      ocop_rating: Number(p.ocop_rating || 0),
      image_url: p.image_url || '',
      description: p.description || '',
      status: p.status || 'published',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingProduct) {
        await fetchAdminApi(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchAdminApi('/api/admin/products', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err: any) {
      alert(`Lỗi lưu sản phẩm: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${name}" không? Thao tác này không thể khôi phục.`)) {
      return;
    }

    try {
      await fetchAdminApi(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      loadProducts();
    } catch (err: any) {
      alert(`Xóa thất bại: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Package className="text-primary" size={24} />
            <span>Kho Sản Phẩm & Đặc Sản OCOP</span>
          </h2>
          <p className="text-xs text-muted mt-1">Quản lý giá, số lượng tồn kho, xếp hạng OCOP và trạng thái công bố trên chợ phiên.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn btn-primary shadow-lg shadow-primary/25 shrink-0"
        >
          <Plus size={18} />
          <span>Thêm Sản phẩm Mới</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="card p-4 flex items-center gap-3">
        <Search size={18} className="text-muted shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên sản phẩm, hoa văn thổ cẩm, sâm..."
          className="input border-0 bg-transparent py-1 text-sm focus:shadow-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-muted hover:text-text">
            <X size={16} />
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Products Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="w-16">Ảnh</th>
              <th>Tên sản phẩm & OCOP</th>
              <th>Đơn giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th className="text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted">
                  <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                  <span>Đang tải danh sách sản phẩm...</span>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-muted">
                  Không tìm thấy sản phẩm nào phù hợp.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="w-12 h-12 rounded-lg bg-background border border-border overflow-hidden flex items-center justify-center">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-muted" />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="font-bold text-sm">{p.name}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {p.ocop_rating ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded text-[11px] font-bold">
                          <Star size={11} className="fill-amber-500 text-amber-500" />
                          <span>OCOP {p.ocop_rating} Sao</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted">Bản địa truyền thống</span>
                      )}
                      <span className="text-[11px] text-muted font-mono ml-2">({p.slug})</span>
                    </div>
                  </td>
                  <td className="font-bold text-sm text-primary">
                    {Number(p.price || 0).toLocaleString('vi-VN')}đ
                  </td>
                  <td>
                    <span className={`font-semibold ${p.stock <= 5 ? 'text-error font-bold' : 'text-text'}`}>
                      {p.stock} sản phẩm
                    </span>
                  </td>
                  <td>
                    {p.status === 'published' ? (
                      <span className="badge badge-success"><CheckCircle2 size={12} className="mr-1 inline" /> Đang bán</span>
                    ) : (
                      <span className="badge badge-gray"><Clock size={12} className="mr-1 inline" /> Bản nháp</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="btn btn-outline py-1 px-2.5 text-xs text-primary hover:bg-primary/10 border-primary/20"
                        title="Chỉnh sửa"
                      >
                        <Edit3 size={14} />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="btn btn-outline py-1 px-2 text-xs text-error hover:bg-error/10 border-error/20"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h3 className="text-lg font-bold">
                {editingProduct ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-text p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Rượu Cần Đồng Bào Bana..."
                  className="input font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Đơn giá (VNĐ) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="input font-bold text-primary"
                    min={0}
                    step={1000}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Số lượng tồn kho *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="input font-semibold"
                    min={0}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Xếp hạng OCOP</label>
                  <select
                    value={formData.ocop_rating}
                    onChange={(e) => setFormData({ ...formData, ocop_rating: Number(e.target.value) })}
                    className="select font-medium"
                  >
                    <option value={0}>Không có xếp hạng</option>
                    <option value={3}>⭐ OCOP 3 Sao</option>
                    <option value={4}>⭐⭐ OCOP 4 Sao</option>
                    <option value={5}>⭐⭐⭐ OCOP 5 Sao (Đặc biệt)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1">Trạng thái công bố</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="select font-semibold"
                  >
                    <option value="published">✅ Đang bán công khai</option>
                    <option value="draft">⏳ Bản nháp (Đang ẩn)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Đường dẫn ảnh (URL)</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1">Mô tả chi tiết sản phẩm</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Giới thiệu nguồn gốc, chất liệu thổ cẩm hay công dụng dược liệu..."
                  className="textarea text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary shadow-lg shadow-primary/25"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <span>{editingProduct ? 'Cập nhật Sản phẩm' : 'Lưu Sản phẩm Mới'}</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
