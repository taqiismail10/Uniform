// uniform-frontend/src/utils/InstitutionProtectedRoutes.tsx
import { useAuth } from '@/context/admin/useAuth'
import { Navigate } from '@tanstack/react-router'

const InstitutionProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/institution/institutionLogin" />
  }

  if (user.role !== 'INSTITUTION_ADMIN') {
    return <Navigate to="/institution/institutionLogin" />
  }

  return children
}

export default InstitutionProtectedRoutes
