import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student/dashboard')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT} >
      <RouteComponent />
    </ProtectedRoutes>
  ),
})

function RouteComponent() {
  return <div>Hello "/student/dashboard"!</div>
}
