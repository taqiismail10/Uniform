import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { ROLES } from '@/utils/role'
import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/institutions')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT}>
      <Outlet />
    </ProtectedRoutes>
  ),
})

export default Route
