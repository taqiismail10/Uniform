import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { listMyApplications, type MyApplication } from '@/api/studentApplications'
import { getUserProfile, getAcademicDetails } from '@/api'
import AdmitCard from '@/components/student/AdmitCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/student/admit/$id')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT}>
      <RouteComponent />
    </ProtectedRoutes>
  ),
})

function RouteComponent() {
  const { id } = useParams({ from: '/student/admit/$id' })
  const search = useSearch({ from: '/student/admit/$id' }) as { download?: string | number | boolean }
  const navigate = useNavigate()
  const [rows, setRows] = useState<MyApplication[] | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const [apps, p, a] = await Promise.all([
          listMyApplications(),
          getUserProfile(),
          getAcademicDetails(),
        ])
        setRows(apps)
        // Merge with preference for non-empty values and keep name from profile
        let merged: any = p && a ? { ...p, ...a } : (p || a)
        if (p?.userName && (!merged?.userName || String(merged.userName).trim() === '')) {
          merged = { ...merged, userName: p.userName }
        }
        setProfile(merged)
      } finally { setLoading(false) }
    })()
  }, [id])

  const app = useMemo(() => (rows || []).find(r => r.id === id), [rows, id])

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-gray-700" onClick={() => navigate({ to: '/student/applications' })}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Applications
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-600">Loading...</div>
        ) : !app ? (
          <div className="py-12 text-center text-gray-600">Application not found.</div>
        ) : !app.reviewedAt ? (
          <div className="py-12 text-center text-gray-600">Admit Card is available only after approval.</div>
        ) : !profile ? (
          <div className="py-12 text-center text-gray-600">Unable to load profile.</div>
        ) : (
          <div className="bg-white shadow rounded-md p-4">
            <AdmitCard
              app={app}
              student={profile}
              institutionLogoUrl={app?.institution?.logoUrl || undefined}
              autoDownload={!!search?.download}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default RouteComponent
