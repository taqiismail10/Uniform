import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute } from '@tanstack/react-router'
import AcademicInfoPage from '@/components/student/AcademicInfoPage'
import { useEffect, useState } from 'react'
import { getAcademicInfo, getUserProfile } from '@/api'
import type { AcademicInfo } from '@/components/student/types'

export const Route = createFileRoute('/student/academic-info')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT}>
      <RouteComponent />
    </ProtectedRoutes>
  ),
})

function RouteComponent() {
  const [info, setInfo] = useState<AcademicInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [sscStream, setSscStream] = useState<'SCIENCE' | 'ARTS' | 'COMMERCE' | undefined>(undefined)
  const [hscStream, setHscStream] = useState<'SCIENCE' | 'ARTS' | 'COMMERCE' | undefined>(undefined)

  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile()
        if (profile) {
          setSscStream(profile.sscStream as any)
          setHscStream(profile.hscStream as any)
          const data = await getAcademicInfo(profile.userId)
          setInfo(data || null)
        }
      } finally { setLoading(false) }
    })()
  }, [])

  return (
    <AcademicInfoPage academicInfo={info} loading={loading} sscStream={sscStream} hscStream={hscStream} />
  )
}

export default Route
