import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import InstitutionProtectedRoutes from '@/utils/InstitutionProtectedRoutes'
import { InstitutionNavbar } from '@/components/institution/InstitutionNavbar'
import { useEffect, useState } from 'react'
import { unitsApi } from '@/api/units'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type UnitDetail = {
  unitId: string
  name: string
  description?: string | null
  isActive?: boolean
  applicationDeadline?: string | null
  maxApplications?: number | null
  autoCloseAfterDeadline?: boolean
  requirements?: Array<{ id: string; sscStream: string; hscStream: string; minSscGPA?: number | null; minHscGPA?: number | null; minCombinedGPA?: number | null }>
  _count?: { applications?: number }
}

export const Route = createFileRoute('/institution/units/$unitId')({
  component: () => (
    <InstitutionProtectedRoutes>
      <RouteComponent />
    </InstitutionProtectedRoutes>
  ),
})

function RouteComponent() {
  const navigate = useNavigate()
  const { unitId } = useParams({ from: '/institution/units/$unitId' })
  const [unit, setUnit] = useState<UnitDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await unitsApi.getById(unitId)
        setUnit(res.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [unitId])

  const handleDelete = async () => {
    if (!confirm('Delete this unit? This action cannot be undone.')) return
    try {
      await unitsApi.remove(unitId)
      toast.success('Unit deleted successfully')
      navigate({ to: '/institution/units', replace: true })
    } catch (e) {
      toast.error('Unable to delete unit. Remove related records first.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InstitutionNavbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {loading ? (
          <div className="py-12 text-center text-gray-600">Loading...</div>
        ) : !unit ? (
          <div className="py-12 text-center text-gray-600">Unit not found</div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{unit.name}</h1>
              <div className="flex items-center gap-2">
                <Button variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100" onClick={() => navigate({ to: '/institution/units/$unitId/edit', params: { unitId } })}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800">
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div>{unit.isActive ? 'Active' : 'Inactive'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Applications</div>
                    <div>{unit._count?.applications ?? 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Deadline</div>
                    <div>{unit.applicationDeadline ? new Date(unit.applicationDeadline).toLocaleString() : '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Max Applications</div>
                    <div>{unit.maxApplications ?? '—'}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500">Description</div>
                    <div className="text-gray-800">{unit.description || '—'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Eligibility Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                {!unit.requirements || unit.requirements.length === 0 ? (
                  <div className="py-8 text-gray-600">No requirements defined.</div>
                ) : (
                  <div className="space-y-3">
                    {unit.requirements.map((r) => (
                      <div key={r.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 border border-gray-200 rounded-md p-3">
                        <div className="rounded-md border border-gray-200 p-3">
                          <div className="text-sm font-medium text-gray-900 mb-2">SSC / Dakhil</div>
                          <div className="text-sm text-gray-600">Stream</div>
                          <div className="text-gray-800 mb-2">{r.sscStream}</div>
                          <div className="text-sm text-gray-600">Min GPA</div>
                          <div className="text-gray-800">{r.minSscGPA ?? '—'}</div>
                        </div>
                        <div className="rounded-md border border-gray-200 p-3">
                          <div className="text-sm font-medium text-gray-900 mb-2">HSC / Alim</div>
                          <div className="text-sm text-gray-600">Stream</div>
                          <div className="text-gray-800 mb-2">{r.hscStream}</div>
                          <div className="text-sm text-gray-600">Min GPA</div>
                          <div className="text-gray-800">{r.minHscGPA ?? '—'}</div>
                        </div>
                        <div className="rounded-md border border-gray-200 p-3">
                          <div className="text-sm font-medium text-gray-900 mb-2">Combined GPA</div>
                          <div className="text-sm text-gray-600">Min Combined GPA (SSC + HSC)</div>
                          <div className="text-gray-800">{r.minCombinedGPA ?? '—'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
