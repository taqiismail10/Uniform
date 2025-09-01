import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute } from '@tanstack/react-router'
import AcademicInfoPage from '@/components/student/AcademicInfoPage'
import { useEffect, useState } from 'react'
import { getAcademicDetails, getUserProfile } from '@/api'
import type { AcademicInfo } from '@/components/student/types'

export const Route = createFileRoute('/student/academic-info')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT}>
      <RouteComponent />
    </ProtectedRoutes>
  ),
})

type Stream = 'SCIENCE' | 'ARTS' | 'COMMERCE'

function normalizeStream(value: unknown): Stream | undefined {
  if (typeof value !== 'string') return undefined
  const up = value.trim().toUpperCase()
  return up === 'SCIENCE' || up === 'ARTS' || up === 'COMMERCE' ? (up as Stream) : undefined
}

function RouteComponent() {
  const [info, setInfo] = useState<AcademicInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [sscStream, setSscStream] = useState<Stream | undefined>(undefined)
  const [hscStream, setHscStream] = useState<Stream | undefined>(undefined)

  useEffect(() => {
    (async () => {
      try {
        // Prefer academic details endpoint (includes examPath and streams)
        const details = await getAcademicDetails()
        if (details) {
          // Streams
          setSscStream(normalizeStream(details.sscStream))
          setHscStream(normalizeStream(details.hscStream))
          // Map to AcademicInfo shape
          const mapped: AcademicInfo = {
            userId: details.userId,
            examPath: (details.examPath || 'NATIONAL') as 'NATIONAL' | 'MADRASHA',
            // National fields
            sscRoll: details.sscRoll || '',
            sscRegistration: details.sscRegistration || '',
            sscGpa: details.sscGpa ? parseFloat(details.sscGpa) : 0,
            sscYear: details.sscYear ? parseInt(details.sscYear) : 0,
            sscBoard: details.sscBoard || '',
            hscRoll: details.hscRoll || '',
            hscRegistration: details.hscRegistration || '',
            hscGpa: details.hscGpa ? parseFloat(details.hscGpa) : 0,
            hscYear: details.hscYear ? parseInt(details.hscYear) : 0,
            hscBoard: details.hscBoard || '',
            // Madrasha fields
            dakhilRoll: details.dakhilRoll || '',
            dakhilRegistration: details.dakhilRegistration || '',
            dakhilGpa: details.dakhilGpa ? parseFloat(details.dakhilGpa) : 0,
            dakhilYear: details.dakhilYear ? parseInt(details.dakhilYear) : 0,
            dakhilBoard: details.dakhilBoard || '',
            alimRoll: details.alimRoll || '',
            alimRegistration: details.alimRegistration || '',
            alimGpa: details.alimGpa ? parseFloat(details.alimGpa) : 0,
            alimYear: details.alimYear ? parseInt(details.alimYear) : 0,
            alimBoard: details.alimBoard || '',
          }
          setInfo(mapped)
        } else {
          // Fallback to profile just to determine examPath & streams
          const profile = await getUserProfile()
          if (profile) {
            setSscStream(normalizeStream(profile.sscStream))
            setHscStream(normalizeStream(profile.hscStream))
            if (profile.examPath) {
              const defaults: AcademicInfo = {
                userId: profile.userId,
                examPath: profile.examPath as 'NATIONAL' | 'MADRASHA',
                sscRoll: '', sscRegistration: '', sscGpa: 0, sscYear: 0, sscBoard: '',
                hscRoll: '', hscRegistration: '', hscGpa: 0, hscYear: 0, hscBoard: '',
                dakhilRoll: '', dakhilRegistration: '', dakhilGpa: 0, dakhilYear: 0, dakhilBoard: '',
                alimRoll: '', alimRegistration: '', alimGpa: 0, alimYear: 0, alimBoard: '',
              }
              setInfo(defaults)
            } else {
              setInfo(null)
            }
          } else {
            setInfo(null)
          }
        }
      } finally { setLoading(false) }
    })()
  }, [])

  return (
    <AcademicInfoPage academicInfo={info} loading={loading} sscStream={sscStream} hscStream={hscStream} />
  )
}

export default Route
