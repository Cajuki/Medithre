import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Request interceptor – attach JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medithrex_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('medithrex_token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

// ─── Auth ────────────────────────────────────────────────────
export const authService = {
  login:    (data)     => api.post('/auth/login', data),
  register: (data)     => api.post('/auth/register', data),
  me:       ()         => api.get('/auth/me'),
  logout:   ()         => api.post('/auth/logout'),
}

// ─── Products ────────────────────────────────────────────────
export const productService = {
  getAll:     (params) => api.get('/products', { params }),
  getById:    (id)     => api.get(`/products/${id}`),
  create:     (data)   => api.post('/products', data),
  update:     (id, data) => api.put(`/products/${id}`, data),
  delete:     (id)     => api.delete(`/products/${id}`),
  getFeatured:()       => api.get('/products/featured'),
  getReviews: (id)     => api.get(`/products/${id}/reviews`),
  addReview:  (id, data) => api.post(`/products/${id}/reviews`, data),
}

// ─── Categories ──────────────────────────────────────────────
export const categoryService = {
  getAll:  ()         => api.get('/categories'),
  create:  (data)     => api.post('/categories', data),
  update:  (id, data) => api.put(`/categories/${id}`, data),
  delete:  (id)       => api.delete(`/categories/${id}`),
}

// ─── Orders ──────────────────────────────────────────────────
export const orderService = {
  create:       (data)         => api.post('/orders', data),
  getMyOrders:  ()             => api.get('/orders/my'),
  getById:      (id)           => api.get(`/orders/${id}`),
  getAll:       (params)       => api.get('/orders', { params }),
  updateStatus: (id, status)   => api.put(`/orders/${id}/status`, { status }),
  cancel:       (id)           => api.put(`/orders/${id}/cancel`),
}

// ─── Users (Admin) ───────────────────────────────────────────
export const userService = {
  getAll:  (params)     => api.get('/users', { params }),
  getById: (id)         => api.get(`/users/${id}`),
  update:  (id, data)   => api.put(`/users/${id}`, data),
  delete:  (id)         => api.delete(`/users/${id}`),
}

// ─── Dashboard ───────────────────────────────────────────────
export const dashboardService = {
  getStats: () => api.get('/admin/stats'),
}

export default api