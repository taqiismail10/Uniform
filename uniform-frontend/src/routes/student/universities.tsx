import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute } from '@tanstack/react-router'
import UniversitiesSection from '@/components/student/UniversitiesSection'

export const Route = createFileRoute('/student/universities')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT}>
      <UniversitiesSection />
    </ProtectedRoutes>
  ),
})

export default Route

