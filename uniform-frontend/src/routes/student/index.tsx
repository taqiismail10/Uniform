import { useAuth } from '@/context/useAuth'
import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/student/')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT} >
      <RouteComponent />
    </ProtectedRoutes>
  ),
})

function RouteComponent() {

  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <Navigate to="/student/dashboard" />
  )
}
