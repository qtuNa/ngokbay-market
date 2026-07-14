import { z } from 'zod';

// price bị bỏ khỏi đây — giá do server fetch từ DB, không tin client.
export const checkoutItemSchema = z.object({
  product_id: z.string().uuid({ message: 'Product ID không đúng định dạng UUID' }),
  quantity: z.number().int().positive({ message: 'Số lượng phải lớn hơn 0' }),
});

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, { message: 'Tên khách hàng tối thiểu 2 ký tự' }),
  customer_phone: z.string().trim().regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng Việt Nam',
  }),
  shipping_address: z.string().trim().min(5, { message: 'Địa chỉ giao hàng quá ngắn' }),
  payment_method: z.enum(['COD', 'BANK_TRANSFER']),
  items: z.array(checkoutItemSchema).nonempty({ message: 'Giỏ hàng không được để trống' }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
// Item type sau khi server enrich (có price từ DB)
export type CheckoutItemWithPrice = z.infer<typeof checkoutItemSchema> & { price: number };