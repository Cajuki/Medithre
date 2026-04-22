import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store'

export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }
  return children
}

export function GuestOnly({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}