import AdminProtectedRoutes from '@/utils/AdminProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: () => (
    <AdminProtectedRoutes role={ROLES.ADMIN} >
      <RouteComponent />
    </AdminProtectedRoutes>
  ),
})

function RouteComponent() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Admin Home Page</h1>
    </div>
  )
}