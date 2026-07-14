import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.product_id === newItem.product_id);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.product_id === newItem.product_id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            )
          };
        }
        return { items: [...state.items, newItem] };
      }),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.product_id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.product_id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'ngokbay-guest-cart',
      skipHydration: true // Bật tính năng này để tương thích tốt với SSR của Next.js App Router
    }
  )
);
