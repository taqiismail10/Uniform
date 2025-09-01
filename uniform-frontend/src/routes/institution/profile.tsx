import { createFileRoute } from '@tanstack/react-router'
import InstitutionProtectedRoutes from '@/utils/InstitutionProtectedRoutes'
import { InstitutionNavbar } from '@/components/institution/InstitutionNavbar'
import { useEffect, useState } from 'react'
import { getInstitutionAdminProfile, type InstitutionAdminProfile } from '@/api/institutionAdmin'

export const Route = createFileRoute('/institution/profile')({
  component: () => (
    <InstitutionProtectedRoutes>
      <RouteComponent />
    </InstitutionProtectedRoutes>
  ),
})

function RouteComponent() {
  const [profile, setProfile] = useState<InstitutionAdminProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try { setProfile(await getInstitutionAdminProfile()) } finally { setLoading(false) }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <InstitutionNavbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        {loading ? (
          <div className="py-12 text-center text-gray-600">Loading...</div>
        ) : !profile ? (
          <div className="py-12 text-center text-gray-600">Failed to load profile</div>
        ) : (
          <div className="space-y-3 text-gray-800">
            <div><span className="text-gray-500 text-sm">Email:</span> <span className="ml-2">{profile.email}</span></div>
            <div><span className="text-gray-500 text-sm">Role:</span> <span className="ml-2">{profile.role}</span></div>
            <div><span className="text-gray-500 text-sm">Last Login:</span> <span className="ml-2">{profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : '—'}</span></div>
            <div><span className="text-gray-500 text-sm">Created:</span> <span className="ml-2">{new Date(profile.createdAt).toLocaleString()}</span></div>
            <div><span className="text-gray-500 text-sm">Updated:</span> <span className="ml-2">{new Date(profile.updatedAt).toLocaleString()}</span></div>
          </div>
        )}
      </main>
    </div>
  )
}

