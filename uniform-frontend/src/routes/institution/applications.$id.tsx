import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { applicationsApi, type ApplicationDetail } from '@/api/applications'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/institution/applications/$id')({
  component: () => <RouteComponent />,
})

function Row({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex justify-between py-1">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-sm text-gray-900">{value ?? '-'}</div>
    </div>
  )
}

function RouteComponent() {
  const { id } = useParams({ from: '/institution/applications/$id' })
  const navigate = useNavigate()
  const [data, setData] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const res = await applicationsApi.getById(id)
        setData(res?.data || null)
      } finally { setLoading(false) }
    })()
  }, [id])

  const app = data
  const student = app?.student
  const unit = app?.unit
  const inst = app?.institution

  return (
    <div className="max-w-7xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" className="text-gray-700" onClick={() => navigate({ to: '/institution/applications' })}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Applications
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Application Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-gray-600">Loading...</div>
          ) : !app ? (
            <div className="py-8 text-gray-600">Application not found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <div className="text-md font-medium text-gray-900 mb-2">Application</div>
                <Row label="Applied At" value={new Date(app.appliedAt).toLocaleString()} />
                <Row label="Status" value={app.reviewedAt ? 'Approved' : 'Under Review'} />
                <Row label="Institution" value={inst?.name} />
                <Row label="Unit" value={unit?.name} />
                {unit?.description && <Row label="Unit Description" value={unit.description} />}
              </div>
              <div className="border rounded-md p-4">
                <div className="text-md font-medium text-gray-900 mb-2">Student</div>
                <Row label="Name" value={student?.fullName} />
                <Row label="Email" value={student?.email} />
                <Row label="Phone" value={student?.phone} />
                <Row label="Curriculum" value={student?.examPath} />
                <Row label="Medium" value={student?.medium} />
                {student?.examPath === 'NATIONAL' ? (
                  <>
                    <Row label="SSC Stream" value={student?.sscStream} />
                    <Row label="HSC Stream" value={student?.hscStream} />
                    <Row label="SSC GPA" value={student?.sscGpa} />
                    <Row label="HSC GPA" value={student?.hscGpa} />
                    <Row label="SSC Board" value={student?.sscBoard} />
                    <Row label="HSC Board" value={student?.hscBoard} />
                    <Row label="SSC Year" value={student?.sscYear} />
                    <Row label="HSC Year" value={student?.hscYear} />
                  </>
                ) : (
                  <>
                    <Row label="Dakhil GPA" value={student?.dakhilGpa} />
                    <Row label="Alim GPA" value={student?.alimGpa} />
                    <Row label="Dakhil Board" value={student?.dakhilBoard} />
                    <Row label="Alim Board" value={student?.alimBoard} />
                    <Row label="Dakhil Year" value={student?.dakhilYear} />
                    <Row label="Alim Year" value={student?.alimYear} />
                  </>
                )}
                <Row label="Address" value={student?.address} />
                {student?.dob && <Row label="DOB" value={new Date(student.dob).toLocaleDateString()} />}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RouteComponent
