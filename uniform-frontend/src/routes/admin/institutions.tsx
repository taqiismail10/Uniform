// uniform-frontend/src/routes/admin/institutions.tsx

import AdminProtectedRoutes from '@/utils/AdminProtectedRoutes'
import { ROLES } from '@/utils/role'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'

export const Route = createFileRoute('/admin/institutions')({
  component: () => (
    <AdminProtectedRoutes role={ROLES.ADMIN}>
      <RouteComponent />
    </AdminProtectedRoutes>
  ),
})

function RouteComponent() {
  const navigate = useNavigate()

  const onTabChange = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        navigate({ to: '/admin/dashboard' })
        break
      case 'institutions':
        navigate({ to: '/admin/institutions' })
        break
      case 'admins':
        navigate({ to: '/admin/admins' })
        break
      case 'visualization':
        navigate({ to: '/admin/visualization' })
        break
      default:
        navigate({ to: '/admin/dashboard' })
    }
  }

  return (
    <AdminLayout activeTab={'institutions'} onTabChange={onTabChange}>
      <Outlet />
    </AdminLayout>
  )
}
