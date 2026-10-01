import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../data/products';

// ─── Types ───────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  house: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pin: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  address: Address;
  paymentMethod: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

// ─── Cart Store ───────────────────────────────────────────────
interface CartState {
  items: CartItem[];
  coupon: string;
  discount: number;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTax: () => number;
  getTotalItems: () => number;
}

const COUPONS: Record<string, number> = {
  SIGMA10: 10,
  SIGMA20: 20,
  FIRSTORDER: 15,
  WELCOME50: 50,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: '',
      discount: 0,

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== id) })),

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === id ? { ...i, quantity: qty } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], coupon: '', discount: 0 }),

      applyCoupon: (code) => {
        const pct = COUPONS[code.toUpperCase()];
        if (pct !== undefined) {
          set({ coupon: code.toUpperCase(), discount: pct });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ coupon: '', discount: 0 }),

      getSubtotal: () =>
        get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),

      getDeliveryFee: () => (get().getSubtotal() >= 299 ? 0 : 30),

      getTax: () => Math.round(get().getSubtotal() * 0.05),

      getTotal: () => {
        const sub = get().getSubtotal();
        const disc = Math.round((sub * get().discount) / 100);
        return sub - disc + get().getDeliveryFee() + get().getTax();
      },

      getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    { name: 'sigma-cart' }
  )
);

// ─── Wishlist Store ───────────────────────────────────────────
interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  toggle: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((s) => ({ items: [...s.items, product] })),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((p) => p.id !== id) })),
      isWishlisted: (id) => get().items.some((p) => p.id === id),
      toggle: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
    }),
    { name: 'sigma-wishlist' }
  )
);

// ─── Orders Store ─────────────────────────────────────────────
interface OrdersState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date'>) => string;
  updateStatus: (id: string, status: Order['status']) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => {
        const id = `SF${Date.now().toString().slice(-6)}`;
        const newOrder: Order = {
          ...order,
          id,
          date: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        };
        set((s) => ({ orders: [newOrder, ...s.orders] }));
        return id;
      },
      updateStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    { name: 'sigma-orders' }
  )
);

// ─── Auth / User Store ────────────────────────────────────────
interface AuthState {
  user: User | null;
  addresses: Address[];
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      addresses: [],
      isLoggedIn: false,

      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      updateUser: (data) =>
        set((s) => ({ user: s.user ? { ...s.user, ...data } : null })),

      addAddress: (address) => {
        const id = `addr_${Date.now()}`;
        set((s) => ({
          addresses: [
            ...s.addresses.map((a) => ({ ...a, isDefault: false })),
            { ...address, id, isDefault: true },
          ],
        }));
      },
      removeAddress: (id) =>
        set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      setDefault: (id) =>
        set((s) => ({
          addresses: s.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        })),
    }),
    { name: 'sigma-auth' }
  )
);

// ─── UI Store (non-persistent) ────────────────────────────────
interface UIState {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isChatbotOpen: boolean;
  activeProductId: string | null;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  setChatbotOpen: (v: boolean) => void;
  toggleChatbot: () => void;
  setActiveProductId: (id: string | null) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isChatbotOpen: false,
  activeProductId: null,
  setCartOpen: (v) => set({ isCartOpen: v }),
  setSearchOpen: (v) => set({ isSearchOpen: v }),
  setMobileMenuOpen: (v) => set({ isMobileMenuOpen: v }),
  setChatbotOpen: (v) => set({ isChatbotOpen: v }),
  toggleChatbot: () => set((s) => ({ isChatbotOpen: !s.isChatbotOpen })),
  setActiveProductId: (id) => set({ activeProductId: id }),
}));
