import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Layouts
import MainLayout  from '@/layouts/mainlayout'
import AdminLayout from '@/layouts/adminlayout'

// Guards
import { RequireAuth, RequireAdmin, GuestOnly } from '@/components/protectedroute'

// Pages
import HomePage         from '@/pages/homepage'
import ProductsPage     from '@/pages/productspage'
import ProductDetailPage from '@/pages/productdetailpage'
import CartPage         from '@/pages/cartpage'
import CheckoutPage     from '@/pages/checkoutpage'
import DashboardPage    from '@/pages/dashboardpage'
import AdminDashboardPage from '@/pages/admindashboardpage'
import AdminProductsPage  from '@/pages/adminproductspage'
import AdminOrdersPage    from '@/pages/adminorderspage'

import { OrderSuccessPage }    from '@/pages/authpages'
import { LoginPage, RegisterPage } from '@/pages/authpages'
import { WishlistPage, NotFoundPage } from '@/pages/miscpages'

import { PageLoader } from '@/components/UI'

// Lazy pages
const AdminUsersPage     = lazy(() => import('@/pages/adminuserspage'))

function AdminPageLoader() {
  return (
    <AdminLayout>
      <PageLoader />
    </AdminLayout>
  )
}

export default function App() {
  return (
    <Routes>
      {/* ── Public routes (with main layout) ── */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/products"    element={<MainLayout><ProductsPage /></MainLayout>} />
      <Route path="/products/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
      <Route path="/cart"        element={<MainLayout><CartPage /></MainLayout>} />
      <Route path="/wishlist"    element={<MainLayout><WishlistPage /></MainLayout>} />
      <Route path="/categories"  element={<Navigate to="/products" replace />} />

      {/* ── Auth routes (no layout) ── */}
      <Route path="/login"    element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

      {/* ── Authenticated user routes ── */}
      <Route path="/checkout" element={<RequireAuth><MainLayout><CheckoutPage /></MainLayout></RequireAuth>} />
      <Route path="/order-success/:orderId" element={<RequireAuth><MainLayout><OrderSuccessPage /></MainLayout></RequireAuth>} />
      <Route path="/dashboard" element={<RequireAuth><MainLayout><DashboardPage /></MainLayout></RequireAuth>} />

      {/* ── Admin routes ── */}
      <Route path="/admin" element={<RequireAdmin><AdminLayout><AdminDashboardPage /></AdminLayout></RequireAdmin>} />
      <Route path="/admin/products" element={<RequireAdmin><AdminLayout><AdminProductsPage /></AdminLayout></RequireAdmin>} />
      <Route path="/admin/orders"   element={<RequireAdmin><AdminLayout><AdminOrdersPage /></AdminLayout></RequireAdmin>} />
      <Route path="/admin/users"    element={
        <RequireAdmin>
          <Suspense fallback={<AdminPageLoader />}>
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          </Suspense>
        </RequireAdmin>
      } />

      {/* ── 404 ── */}
      <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
    </Routes>
  )
}
