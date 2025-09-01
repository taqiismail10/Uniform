import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { unitsApi } from '@/api/units'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// Layout and protection are provided by parent /institution route

type UnitRow = {
  unitId: string
  name: string
  isActive?: boolean
  applicationDeadline?: string | null
  _count?: { applications?: number }
}

export const Route = createFileRoute('/institution/units/')({
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<UnitRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await unitsApi.list({ page: 1, limit: 50 })
        setRows(res?.data || [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleDelete = async (unitId: string) => {
    setDeletingId(unitId)
    try {
      const res = await unitsApi.remove(unitId)
      if (res?.status === 200) {
        setRows((prev) => prev.filter((r) => r.unitId !== unitId))
        toast.success('Unit deleted successfully')
      } else {
        toast.error(res?.message || 'Unable to delete unit. Remove related records first.')
      }
    } catch (e) {
      toast.error('Unable to delete unit. Remove related records first.')
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Units</h1>
        <Button className="bg-gray-900 hover:bg-gray-800" onClick={() => navigate({ to: "/institution/units/create" })}>
          <Plus className="h-4 w-4 mr-2" /> Create Unit
        </Button>
      </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Unit List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-gray-600">Loading...</div>
            ) : rows.length === 0 ? (
              <div className="py-12 text-center text-gray-600">No units yet. Create your first unit.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((u) => (
                    <TableRow key={u.unitId} className="cursor-pointer" onClick={() => navigate({ to: "/institution/units/$unitId", params: { unitId: u.unitId } })}>
                      <TableCell className="text-gray-900 font-medium">{u.name}</TableCell>
                      <TableCell className="text-gray-700">{u.applicationDeadline ? new Date(u.applicationDeadline).toLocaleString() : "—"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${u.isActive ? `bg-gray-200 text-gray-800` : `bg-gray-100 text-gray-500`}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">{u._count?.applications ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="secondary"
                            className="border border-gray-300 text-gray-800 hover:bg-gray-100"
                            onClick={() => navigate({ to: "/institution/units/$unitId/edit", params: { unitId: u.unitId } })}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            disabled={deletingId === u.unitId}
                            onClick={() => setConfirmDeleteId(u.unitId)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      {/* Delete confirmation dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Unit?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the unit and related data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!!deletingId}
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
            >
              {deletingId ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

