import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { listMyApplications, deleteApplication, type MyApplication } from '@/api/studentApplications'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export const Route = createFileRoute('/student/applications')({
  component: RouteComponent,
})

function formatStatus(app: MyApplication) {
  return app.reviewedAt ? 'Approved' : 'Under Review'
}

function RouteComponent() {
  const [rows, setRows] = useState<MyApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const data = await listMyApplications()
      setRows(data)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [])

  const doDelete = async (id: string) => {
    setDeleting(id)
    try {
      const ok = await deleteApplication(id)
      if (ok) {
        setRows(prev => prev.filter(r => r.id !== id))
        toast.success('Application deleted')
      } else {
        toast.error('Unable to delete application')
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      const msg = err?.response?.data?.message || 'Unable to delete application'
      toast.error(msg)
    } finally { setDeleting(null) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-gray-600">Loading...</div>
            ) : rows.length === 0 ? (
              <div className="py-8 text-gray-600">No applications yet. Visit <Link to="/student/universities" className="text-blue-600 hover:underline">Universities</Link> to apply.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applied At</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-gray-700">{new Date(r.appliedAt).toLocaleString()}</TableCell>
                      <TableCell className="text-gray-900 font-medium">{r.institution?.name || '-'}</TableCell>
                      <TableCell className="text-gray-700">{r.unit?.name || '-'}</TableCell>
                      <TableCell className="text-gray-700">{formatStatus(r)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {r.reviewedAt ? (
                            <Button variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100" asChild>
                              <Link to="/student/admit/$id" params={{ id: r.id }}>View Admit Card</Link>
                            </Button>
                          ) : (
                            <Button variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100" asChild>
                              <Link to="/student/universities">View Details</Link>
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            disabled={!!r.reviewedAt || deleting === r.id}
                            onClick={() => doDelete(r.id)}
                            title={r.reviewedAt ? 'Approved applications cannot be deleted' : undefined}
                          >
                            {deleting === r.id ? 'Deleting...' : 'Delete'}
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
      </main>
      {null}
    </div>
  )
}

export default RouteComponent
