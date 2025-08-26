// uniform-frontend/src/routes/admin/institutions.tsx

import AdminProtectedRoutes from '@/utils/AdminProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { InstitutionManagement } from '@/components/admin/InstitutionManagement'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/institutions')({
  component: () => (
    <AdminProtectedRoutes role={ROLES.ADMIN}>
      <RouteComponent />
    </AdminProtectedRoutes>
  ),
})

function RouteComponent() {
  const navigate = useNavigate()
  const search = Route.useSearch() as Partial<{
    page: number
    q: string
    sortField: 'name' | 'createdAt'
    sortDirection: 'asc' | 'desc'
  }>

  const page = search.page ?? 1
  const q = search.q ?? ''
  const sortField = search.sortField ?? 'createdAt'
  const sortDirection = search.sortDirection ?? 'desc'

  const updateSearch = (patch: Partial<typeof search>) => {
    navigate({
      to: '/admin/institutions',
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
    })
  }

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
      <InstitutionManagement
        page={page}
        search={q}
        sortFieldProp={sortField}
        sortDirectionProp={sortDirection}
        onPageChange={(p) => updateSearch({ page: p })}
        onSearchChange={(s) => updateSearch({ q: s, page: 1 })}
        onSortChange={(f, d) => updateSearch({ sortField: f, sortDirection: d, page: 1 })}
      />
    </AdminLayout>
  )
}
