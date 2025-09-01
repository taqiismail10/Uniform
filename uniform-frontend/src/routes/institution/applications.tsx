import { createFileRoute } from '@tanstack/react-router'
import InstitutionProtectedRoutes from '@/utils/InstitutionProtectedRoutes'
import { InstitutionNavbar } from '@/components/institution/InstitutionNavbar'
import { useEffect, useState } from 'react'
import { applicationsApi, type ApplicationRow } from '@/api/applications'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'

export const Route = createFileRoute('/institution/applications')({
  component: () => (
    <InstitutionProtectedRoutes>
      <RouteComponent />
    </InstitutionProtectedRoutes>
  ),
})

function RouteComponent() {
  const [rows, setRows] = useState<ApplicationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await applicationsApi.list({ page: 1, limit: 50, search })
      setRows(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <InstitutionNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <div className="flex items-center gap-2">
            <Input placeholder="Search student or unit" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100" onClick={fetchData}>Search</Button>
          </div>
        </div>
        <div className="border rounded-xl bg-white">
          {loading ? (
            <div className="py-12 text-center text-gray-600">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-gray-600">No applications found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applied At</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-gray-700">{new Date(r.appliedAt).toLocaleString()}</TableCell>
                    <TableCell className="text-gray-900 font-medium">{r.student.fullName}</TableCell>
                    <TableCell className="text-gray-700">{r.student.email}</TableCell>
                    <TableCell className="text-gray-700">{r.unit.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </main>
    </div>
  )
}

