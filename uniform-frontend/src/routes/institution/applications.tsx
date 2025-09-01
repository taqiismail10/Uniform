import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { applicationsApi, type ApplicationRow } from '@/api/applications'
import { unitsApi } from '@/api/units'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'
// Layout and protection are provided by parent /institution route

export const Route = createFileRoute('/institution/applications')({
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const [rows, setRows] = useState<ApplicationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [units, setUnits] = useState<Array<{ unitId: string; name: string }>>([])
  const [unitId, setUnitId] = useState<string>('')
  const [examPath, setExamPath] = useState<'' | 'NATIONAL' | 'MADRASHA'>('')
  const [medium, setMedium] = useState<'' | 'Bangla' | 'English' | 'Arabic'>('')
  const [board, setBoard] = useState<string>('')

  const boardOptions = ['Dhaka','Rajshahi','Chittagong','Jessore','Comilla','Sylhet','Barisal','Dinajpur','Madrasha','Technical']

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await applicationsApi.list({ page: 1, limit: 50, search, unitId: unitId || undefined, examPath: examPath || undefined, medium: medium || undefined, board: board || undefined })
      setRows(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await unitsApi.list({ page: 1, limit: 100 })
        const list = (res?.data || []).map((u: any) => ({ unitId: u.unitId, name: u.name }))
        setUnits(list)
      } catch { /* ignore */ }
      fetchData()
    })()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <div className="flex items-center gap-2">
            <Input placeholder="Search student or unit" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100" onClick={fetchData}>Search</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div>
            <label className="text-xs text-gray-600">Unit</label>
            <Select value={unitId || 'ALL'} onValueChange={(v) => setUnitId(v === 'ALL' ? '' : v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="All units" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {units.map(u => (<SelectItem key={u.unitId} value={u.unitId}>{u.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-gray-600">Curriculum</label>
            <Select value={examPath || 'ALL'} onValueChange={(v: any) => setExamPath(v === 'ALL' ? '' : v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="NATIONAL">National</SelectItem>
                <SelectItem value="MADRASHA">Madrasha</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-gray-600">Medium</label>
            <Select value={medium || 'ALL'} onValueChange={(v: any) => setMedium(v === 'ALL' ? '' : v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="Bangla">Bangla</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-gray-600">Board</label>
            <Select value={board || 'ALL'} onValueChange={(v) => setBoard(v === 'ALL' ? '' : v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {boardOptions.map(b => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100" onClick={fetchData}>Apply Filters</Button>
        </div>
      </div>
      <div className="border rounded-xl bg-white">
        {loading ? (
          <div className="py-12 text-center text-gray-600">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-gray-600">No applications found.</div>
        ) : (
          <div className="divide-y">
            {Object.values(rows.reduce((acc: any, r) => {
              const key = r.unit.unitId
              if (!acc[key]) acc[key] = { unit: r.unit, items: [] as ApplicationRow[] }
              acc[key].items.push(r)
              return acc
            }, {})).map((group: { unit: { unitId: string; name: string }, items: ApplicationRow[] }) => (
              <div key={group.unit.unitId} className="py-4">
                <div className="px-4 pb-2 text-gray-900 font-semibold">{group.unit.name}</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applied At</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Curriculum</TableHead>
                      <TableHead>Medium</TableHead>
                      <TableHead>Board</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.items.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-gray-700">{new Date(r.appliedAt).toLocaleString()}</TableCell>
                        <TableCell className="text-gray-900 font-medium">{r.student.fullName}</TableCell>
                        <TableCell className="text-gray-700">{r.student.email}</TableCell>
                        <TableCell className="text-gray-700">{r.student.examPath || '-'}</TableCell>
                        <TableCell className="text-gray-700">{r.student.medium || '-'}</TableCell>
                        <TableCell className="text-gray-700">{r.student.sscBoard || r.student.hscBoard || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
