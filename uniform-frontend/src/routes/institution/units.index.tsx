import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import InstitutionProtectedRoutes from '@/utils/InstitutionProtectedRoutes'
import { InstitutionNavbar } from '@/components/institution/InstitutionNavbar'
import { useEffect, useState } from 'react'
import { unitsApi } from '@/api/units'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'

type UnitRow = {
  unitId: string
  name: string
  isActive?: boolean
  applicationDeadline?: string | null
  _count?: { applications?: number }
}

export const Route = createFileRoute('/institution/units/')({
  component: () => (
    <InstitutionProtectedRoutes>
      <RouteComponent />
    </InstitutionProtectedRoutes>
  ),
})

function RouteComponent() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<UnitRow[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-gray-50">
      <InstitutionNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

