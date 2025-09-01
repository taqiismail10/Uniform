import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute } from '@tanstack/react-router'
import StudentSettings from '@/components/student/StudentSettings'
import { useEffect, useState } from 'react'
import { getUserProfile } from '@/api'
import type { UserData } from '@/components/student/types'

export const Route = createFileRoute('/student/settings')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT}>
      <RouteComponent />
    </ProtectedRoutes>
  ),
})

function RouteComponent() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile()
        if (profile) setUserData(profile)
      } catch {/* ignore */}
    })()
  }, [])

  if (!userData) {
    return <div className="py-12 text-center text-gray-600">Loading settings...</div>
  }

  return <StudentSettings userData={userData} />
}

export default Route

