import { createFileRoute, useParams, useNavigate, Outlet, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { unitsApi } from '@/api/units'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Edit, Trash2, ArrowLeft } from 'lucide-react'
// Layout and protection are provided by parent /institution route

type UnitDetail = {
  unitId: string
  name: string
  description?: string | null
  isActive?: boolean
  applicationDeadline?: string | null
  maxApplications?: number | null
  autoCloseAfterDeadline?: boolean
  requirements?: Array<{
    sscStream?: string
    hscStream?: string
    minSscGPA?: number | null
    minHscGPA?: number | null
    minCombinedGPA?: number | null
    minSscYear?: number | null
    maxSscYear?: number | null
    minHscYear?: number | null
    maxHscYear?: number | null
  }>
  _count?: { applications?: number }
}

export const Route = createFileRoute('/institution/units/$unitId')({
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const params = useParams({ from: '/institution/units/$unitId' })
  const unitId = params.unitId
  const navigate = useNavigate()
  const isEditing = useRouterState({
    select: (s) => s.matches.some((m) => m.routeId === '/institution/units/$unitId/edit'),
  })
  const [unit, setUnit] = useState<UnitDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const res = await unitsApi.getById(unitId)
        setUnit(res?.data ?? null)
      } catch {
        toast.error('Unable to load unit')
      } finally {
        setLoading(false)
      }
    })()
  }, [unitId])

  const performDelete = async () => {
    if (!unit) return
    setDeleting(true)
    try {
      const res = await unitsApi.remove(unit.unitId)
      if (res?.status === 200) {
        toast.success('Unit deleted successfully')
        navigate({ to: '/institution/units' })
      } else {
        toast.error(res?.message || 'Unable to delete unit. Remove related records first.')
      }
    } catch {
      toast.error('Unable to delete unit. Remove related records first.')
    } finally {
      setDeleting(false)
      setOpenDelete(false)
    }
  }

  if (isEditing) {
    // When the child edit route is active, render the child only.
    return <Outlet />
  }

  return (
    <div className="max-w-5xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-gray-700" onClick={() => navigate({ to: '/institution/units' })}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Unit Details</h1>
          </div>
          {unit && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="border border-gray-300 text-gray-800 hover:bg-gray-100"
                onClick={() => navigate({ to: '/institution/units/$unitId/edit', params: { unitId: unit.unitId } })}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button variant="destructive" onClick={() => setOpenDelete(true)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          )}
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">{loading ? 'Loading...' : unit?.name || 'Unit'}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-gray-600">Loading unit details...</div>
            ) : !unit ? (
              <div className="py-12 text-center text-gray-600">Unit not found</div>
            ) : (
              <div className="space-y-4">
                {unit.description ? (
                  <p className="text-gray-700">{unit.description}</p>
                ) : (
                  <p className="text-gray-500">No description provided.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Application Deadline</div>
                    <div className="text-gray-800">{unit.applicationDeadline ? new Date(unit.applicationDeadline).toLocaleString() : '—'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Max Applications</div>
                    <div className="text-gray-800">{unit.maxApplications ?? '—'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Status</div>
                    <div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${unit.isActive ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500'}`}>
                        {unit.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Auto Close After Deadline</div>
                    <div className="text-gray-800">{unit.autoCloseAfterDeadline ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                <div className="pt-2">
                  <h2 className="text-base font-semibold text-gray-900 mb-2">Eligibility Requirements</h2>
                  {unit.requirements && unit.requirements.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SSC Stream</TableHead>
                          <TableHead>HSC Stream</TableHead>
                          <TableHead>Min SSC GPA</TableHead>
                          <TableHead>Min HSC GPA</TableHead>
                          <TableHead>Min Combined GPA</TableHead>
                          <TableHead>Min SSC Year</TableHead>
                          <TableHead>Max SSC Year</TableHead>
                          <TableHead>Min HSC Year</TableHead>
                          <TableHead>Max HSC Year</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {unit.requirements.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell>{r.sscStream ?? '—'}</TableCell>
                            <TableCell>{r.hscStream ?? '—'}</TableCell>
                            <TableCell>{r.minSscGPA ?? '—'}</TableCell>
                            <TableCell>{r.minHscGPA ?? '—'}</TableCell>
                            <TableCell>{r.minCombinedGPA ?? '—'}</TableCell>
                            <TableCell>{(r as any).minSscYear ?? '—'}</TableCell>
                            <TableCell>{(r as any).maxSscYear ?? '—'}</TableCell>
                            <TableCell>{(r as any).minHscYear ?? '—'}</TableCell>
                            <TableCell>{(r as any).maxHscYear ?? '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-gray-500">No requirements specified.</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Unit?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the unit and related data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={deleting} onClick={performDelete}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RouteComponent
