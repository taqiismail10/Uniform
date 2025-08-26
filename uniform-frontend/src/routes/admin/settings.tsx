// uniform-frontend/src/routes/admin/settings.tsx

import AdminProtectedRoutes from '@/utils/AdminProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/settings')({
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
    <AdminLayout activeTab={'settings'} onTabChange={onTabChange}>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Admin settings appear here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

