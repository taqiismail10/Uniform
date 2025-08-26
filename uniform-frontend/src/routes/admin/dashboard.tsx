// uniform-frontend/src/routes/admin/dashboard.tsx

import AdminProtectedRoutes from '@/utils/AdminProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { DashboardOverview } from '@/components/admin/DashboardOverview'
import { InstitutionManagement } from '@/components/admin/InstitutionManagement'
import { AdminManagement } from '@/components/admin/AdminManagement'
import { DataVisualization } from '@/components/admin/DataVisualization'

export const Route = createFileRoute('/admin/dashboard')({
  component: () => (
    <AdminProtectedRoutes role={ROLES.ADMIN}>
      <RouteComponent />
    </AdminProtectedRoutes>
  ),
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'institutions':
        return <InstitutionManagement />
      case 'admins':
        return <AdminManagement />
      case 'visualization':
        return <DataVisualization />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveTab()}
    </AdminLayout>
  )
}