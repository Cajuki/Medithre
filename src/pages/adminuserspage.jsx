import { useEffect, useState } from 'react'
import { Users, Shield, Search } from 'lucide-react'
import { userService } from '@/services/api'
import { PageLoader, Alert, EmptyState, Badge } from '@/components/common/UI'

const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@medithrex.com', role: 'admin' },
  { id: 2, name: 'Jane Doe', email: 'jane@hospital.co.ke', role: 'customer' },
  { id: 3, name: 'Lab Tech', email: 'lab@clinic.co.ke', role: 'customer' },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userService.getAll({ search: query || undefined })
        setUsers(data?.users || MOCK_USERS)
      } catch {
        setUsers(MOCK_USERS)
        setError('Showing demo users because the API is unavailable.')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [query])

  if (loading) return <PageLoader />

  const filteredUsers = users.filter((user) => {
    const term = query.trim().toLowerCase()
    if (!term) return true

    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display text-primary-900">Users</h1>
          <p className="text-sm text-slate-500">Manage customers and admin accounts.</p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users"
            className="input pl-10"
          />
        </div>
      </div>

      {error && <Alert type="info" message={error} />}

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try a different search term or connect the backend users endpoint."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-sm text-slate-500">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{user.name}</p>
                          <p className="text-xs text-slate-400">User ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'admin' ? 'primary' : 'default'} className="inline-flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
