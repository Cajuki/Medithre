import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Auth Store ───────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        localStorage.setItem('medithrex_token', token)
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('medithrex_token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),

      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'medithrex-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// ─── Cart Store ───────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find(i => i.id === product.id)
        if (existing) {
          set({
            items: items.map(i =>
              i.id === product.id
                ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                : i
            )
          })
        } else {
          set({ items: [...items, { ...product, quantity }] })
        }
      },

      removeItem: (id) => set((state) => ({
        items: state.items.filter(i => i.id !== id)
      })),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return get().removeItem(id)
        set((state) => ({
          items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
        }))
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
    }),
    { name: 'medithrex-cart' }
  )
)

// ─── Wishlist Store ───────────────────────────────────────────
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const exists = get().items.find(i => i.id === product.id)
        if (exists) {
          set((state) => ({ items: state.items.filter(i => i.id !== product.id) }))
          return false
        } else {
          set((state) => ({ items: [...state.items, product] }))
          return true
        }
      },

      isWishlisted: (id) => !!get().items.find(i => i.id === id),
    }),
    { name: 'medithrex-wishlist' }
  )
)