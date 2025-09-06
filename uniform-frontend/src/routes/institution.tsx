import { Outlet, createFileRoute } from '@tanstack/react-router'
import InstitutionProtectedRoutes from '@/utils/InstitutionProtectedRoutes'
import { InstitutionNavbar } from '@/components/institution/InstitutionNavbar'

export const Route = createFileRoute('/institution')({
  component: () => (
    <InstitutionProtectedRoutes>
      <RouteComponent />
    </InstitutionProtectedRoutes>
  ),
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <InstitutionNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default RouteComponent

