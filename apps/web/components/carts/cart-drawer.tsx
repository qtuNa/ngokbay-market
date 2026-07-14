'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, type CheckoutInput } from '@repo/validation';
import { useCartStore } from '../../src/store/useCartStore';
import { fetchApi } from '../../src/lib/api';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Khắc phục lỗi SSR Hydration của Next.js: Đợi component mount xong trên client mới render giỏ hàng
  useEffect(() => {
    useCartStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      items: []
    }
  });

  // Cập nhật danh sách items vào react-hook-form mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    if (items.length > 0) {
      setValue('items', items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      })) as any);
    }
  }, [items, setValue]);

  const onCheckoutSubmit = async (data: CheckoutInput) => {
    if (items.length === 0) return alert('Giỏ hàng của bạn đang trống!');
    setCheckoutError(null);

    try {
      const response = await fetchApi<{ success: boolean; orderId: string }>('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      alert(`Đặt hàng thành công! Mã đơn: ${response.orderId}`);
      clearCart();
      reset();
      setIsOpen(false);
    } catch (error: any) {
      setCheckoutError(error.message || 'Có lỗi xảy ra.');
    }
  };

  if (!isHydrated) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: '400px',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 100,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ 
          padding: 'var(--space-4)', 
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={24} /> Giỏ Hàng
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ 
          flex: 1, overflowY: 'auto', padding: 'var(--space-4)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'
        }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: 'var(--space-8)' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
              <p>Chưa có đặc sản nào được chọn.</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div key={item.product_id} style={{ display: 'flex', gap: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)' }}>
                    {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="font-semibold text-sm" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.name}
                    </p>
                    <p className="font-bold text-primary text-sm mt-1">{item.price.toLocaleString('vi-VN')} ₫</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.875rem', padding: '0 8px', fontWeight: 600 }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          style={{ padding: '4px 8px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.product_id)}
                        style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Checkout Section */}
        {items.length > 0 && (
          <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <span className="font-semibold">Tạm tính:</span>
              <span className="font-bold text-lg text-primary">{totalPrice.toLocaleString('vi-VN')} ₫</span>
            </div>
            
            {checkoutError && (
              <div style={{ color: 'var(--color-error)', fontSize: '0.875rem', marginBottom: 'var(--space-3)', padding: 'var(--space-2)', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-md)' }}>
                {checkoutError}
              </div>
            )}

            <form onSubmit={handleSubmit(onCheckoutSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <input
                  {...register('customer_name')}
                  className="input"
                  placeholder="Tên người nhận"
                />
                {errors.customer_name && <p className="text-error text-xs mt-1">{errors.customer_name.message}</p>}
              </div>

              <div>
                <input
                  {...register('customer_phone')}
                  className="input"
                  placeholder="Số điện thoại"
                />
                {errors.customer_phone && <p className="text-error text-xs mt-1">{errors.customer_phone.message}</p>}
              </div>

              <div>
                <textarea
                  {...register('shipping_address')}
                  className="input"
                  rows={2}
                  placeholder="Địa chỉ giao hàng (Số nhà, Đường, Thôn/Xã...)"
                />
                {errors.shipping_address && <p className="text-error text-xs mt-1">{errors.shipping_address.message}</p>}
              </div>

              <div>
                <select {...register('payment_method')} className="input">
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                </select>
                {errors.payment_method && <p className="text-error text-xs mt-1">{errors.payment_method.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary mt-2"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
