import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { applicationsApi, type ApplicationRow } from '@/api/applications'
import { unitsApi } from '@/api/units'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
// Layout and protection are provided by parent /institution route

export const Route = createFileRoute('/institution/applications')({
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<ApplicationRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [units, setUnits] = useState<Array<{ unitId: string; name: string }>>([])
  const [unitId, setUnitId] = useState<string>('')
  const [examPath, setExamPath] = useState<'' | 'NATIONAL' | 'MADRASHA'>('')
  const [medium, setMedium] = useState<'' | 'Bangla' | 'English' | 'Arabic'>('')
  const [board, setBoard] = useState<string>('')
  const [status, setStatus] = useState<'' | 'approved' | 'under_review'>('')
  const [center, setCenter] = useState<string>('')
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'cancel'; id: string | null } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detail, setDetail] = useState<any | null>(null)
  const [seatNo, setSeatNo] = useState('')
  const [examDate, setExamDate] = useState('')
  const [examTime, setExamTime] = useState('')
  const [examCenter, setExamCenter] = useState('')
  const [centerOptions, setCenterOptions] = useState<string[]>([])

  // Fixed division list for exam centers
  const divisionOptions = ['Dhaka','Chattogram','Rajshahi','Khulna','Barishal','Sylhet','Rangpur','Mymensingh']

  const boardOptions = ['Dhaka','Rajshahi','Chittagong','Jessore','Comilla','Sylhet','Barisal','Dinajpur','Madrasha','Technical']

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await applicationsApi.list({ page: 1, limit: 50, search, unitId: unitId || undefined, examPath: examPath || undefined, medium: medium || undefined, board: board || undefined, status: status || undefined, center: center || undefined })
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
        // Use fixed division options for exam center filter
        setCenterOptions(divisionOptions)
      } catch { /* ignore */ }
      fetchData()
    })()
  }, [])

  const openDetail = async (id: string) => {
    setDetailOpen(true)
    setDetailLoading(true)
    try {
      const res = await applicationsApi.getById(id)
      const d = res?.data || null
      setDetail(d)
      setSeatNo(d?.seatNo || '')
      setExamDate(d?.examDate ? new Date(d.examDate).toISOString().substring(0,10) : '')
      setExamTime(d?.examTime || '')
      setExamCenter(d?.examCenter || d?.centerPreference || '')
    } finally {
      setDetailLoading(false)
    }
  }

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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
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
            <label className="text-xs text-gray-600">Status</label>
            <Select value={status || 'ALL'} onValueChange={(v: any) => setStatus(v === 'ALL' ? '' : v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
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
          <div>
            <label className="text-xs text-gray-600">Exam Center</label>
            <Select value={center || 'ALL'} onValueChange={(v: any) => setCenter(v === 'ALL' ? '' : v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {centerOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
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
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.items.map((r) => (
                      <TableRow key={r.id} className="cursor-pointer" onClick={() => openDetail(r.id)}>
                        <TableCell className="text-gray-700">{new Date(r.appliedAt).toLocaleString()}</TableCell>
                        <TableCell className="text-gray-900 font-medium">{r.student.fullName}</TableCell>
                        <TableCell className="text-gray-700">{r.student.email}</TableCell>
                        <TableCell className="text-gray-700">{r.student.examPath || '-'}</TableCell>
                        <TableCell className="text-gray-700">{r.student.medium || '-'}</TableCell>
                        <TableCell className="text-gray-700">{r.student.sscBoard || r.student.hscBoard || '-'}</TableCell>
                        <TableCell className="text-gray-700">{(r as any).reviewedAt ? 'Approved' : 'Under Review'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </div>
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="w-screen sm:max-w-[100vw] md:max-w-[70vw] lg:max-w-[70vw] xl:max-w-[70vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review the application and student information</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2 px-4 md:px-6">
            <Button
              variant="destructive"
              className="disabled:opacity-60"
              disabled={!!detail?.reviewedAt}
              onClick={() => setConfirmAction({ type: 'cancel', id: detail?.id })}
              title={detail?.reviewedAt ? 'Already approved' : undefined}
            >
              Cancel Application
            </Button>
            <Button
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
              disabled={!!detail?.reviewedAt}
              onClick={() => setConfirmAction({ type: 'approve', id: detail?.id })}
              title={detail?.reviewedAt ? 'Already approved' : undefined}
            >
              Approve
            </Button>
          </div>
          <div className="space-y-6 p-4 md:p-6">
            {detailLoading ? (
              <div className="py-6 text-gray-600">Loading...</div>
            ) : !detail ? (
              <div className="py-6 text-gray-600">No data</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-gray-900">
                <div className="border rounded-md p-4 bg-white">
                  <div className="text-md font-semibold mb-3">Application</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-500">Applied At</div>
                    <div>{new Date(detail.appliedAt).toLocaleString()}</div>
                    <div className="text-gray-500">Status</div>
                    <div>{detail.reviewedAt ? 'Approved' : 'Under Review'}</div>
                    <div className="text-gray-500">Institution</div>
                    <div>{detail.institution?.name || '-'}</div>
                    <div className="text-gray-500">Unit</div>
                    <div>{detail.unit?.name || '-'}</div>
                    {detail.unit?.description && (
                      <>
                        <div className="text-gray-500">Unit Description</div>
                        <div className="col-span-1 lg:col-span-1">{detail.unit.description}</div>
                      </>
                    )}
                  </div>
                </div>
                <div className="border rounded-md p-4 bg-white">
                  <div className="text-md font-semibold mb-3">Student</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-gray-500">Name</div>
                    <div>{detail.student?.fullName || '-'}</div>
                    <div className="text-gray-500">Email</div>
                    <div>{detail.student?.email || '-'}</div>
                    <div className="text-gray-500">Phone</div>
                    <div>{detail.student?.phone || '-'}</div>
                    <div className="text-gray-500">Curriculum</div>
                    <div>{detail.student?.examPath || '-'}</div>
                    <div className="text-gray-500">Medium</div>
                    <div>{detail.student?.medium || '-'}</div>
                    {detail.student?.examPath === 'NATIONAL' ? (
                      <>
                        <div className="text-gray-500">SSC Stream</div>
                        <div>{detail.student?.sscStream || '-'}</div>
                        <div className="text-gray-500">HSC Stream</div>
                        <div>{detail.student?.hscStream || '-'}</div>
                        <div className="text-gray-500">SSC GPA</div>
                        <div>{detail.student?.sscGpa ?? '-'}</div>
                        <div className="text-gray-500">HSC GPA</div>
                        <div>{detail.student?.hscGpa ?? '-'}</div>
                        <div className="text-gray-500">SSC Board</div>
                        <div>{detail.student?.sscBoard || '-'}</div>
                        <div className="text-gray-500">HSC Board</div>
                        <div>{detail.student?.hscBoard || '-'}</div>
                        <div className="text-gray-500">SSC Year</div>
                        <div>{detail.student?.sscYear ?? '-'}</div>
                        <div className="text-gray-500">HSC Year</div>
                        <div>{detail.student?.hscYear ?? '-'}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-500">Dakhil GPA</div>
                        <div>{detail.student?.dakhilGpa ?? '-'}</div>
                        <div className="text-gray-500">Alim GPA</div>
                        <div>{detail.student?.alimGpa ?? '-'}</div>
                        <div className="text-gray-500">Dakhil Board</div>
                        <div>{detail.student?.dakhilBoard || '-'}</div>
                        <div className="text-gray-500">Alim Board</div>
                        <div>{detail.student?.alimBoard || '-'}</div>
                        <div className="text-gray-500">Dakhil Year</div>
                        <div>{detail.student?.dakhilYear ?? '-'}</div>
                        <div className="text-gray-500">Alim Year</div>
                        <div>{detail.student?.alimYear ?? '-'}</div>
                      </>
                    )}
                    <div className="text-gray-500">Address</div>
                    <div>{detail.student?.address || '-'}</div>
                    {detail.student?.dob && (
                      <>
                        <div className="text-gray-500">DOB</div>
                        <div>{new Date(detail.student.dob).toLocaleDateString()}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm action modal */}
      <Dialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>{confirmAction?.type === 'approve' ? 'Approve Application?' : 'Cancel Application?'}</DialogTitle>
            <DialogDescription>
              {confirmAction?.type === 'approve'
                ? 'This will mark the application as approved.'
                : 'This will permanently remove the application. This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Close</Button>
            <Button
              variant={confirmAction?.type === 'approve' ? 'default' : 'destructive'}
              className={confirmAction?.type === 'approve' ? 'bg-gray-900 hover:bg-gray-800' : ''}
              disabled={actionLoading}
              onClick={async () => {
                if (!confirmAction?.id) return;
                setActionLoading(true);
                try {
                  if (confirmAction.type === 'approve') {
                    const res = await applicationsApi.approve(confirmAction.id);
                    if (res.status === 200) {
                      toast.success('Application approved');
                      setDetail((d: any) => d ? { ...d, reviewedAt: new Date().toISOString() } : d);
                      fetchData();
                    } else {
                      toast.error(res.message || 'Failed to approve application');
                    }
                  } else {
                    const res = await applicationsApi.remove(confirmAction.id);
                    if (res.status === 200) {
                      toast.success('Application cancelled');
                      setDetailOpen(false);
                      fetchData();
                    } else {
                      toast.error(res.message || 'Failed to cancel application');
                    }
                  }
                } catch (e: any) {
                  const msg = e?.response?.data?.message || 'Action failed';
                  toast.error(msg);
                } finally {
                  setActionLoading(false);
                  setConfirmAction(null);
                }
              }}
            >
              {actionLoading ? 'Working...' : (confirmAction?.type === 'approve' ? 'Confirm Approve' : 'Confirm Cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

