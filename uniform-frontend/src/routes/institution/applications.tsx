import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from 'react'
import { applicationsApi, type ApplicationRow, type ApplicationDetail } from '@/api/applications'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { unitsApi } from '@/api/units'
import { getMyInstitution, type InstitutionInfo } from '@/api/institutionAdmin'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

// Stable constants (outside component) so hooks don't depend on array identity
const DIVISION_OPTIONS = ['Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'] as const
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
  const [status, setStatus] = useState<'' | 'approved' | 'under_review'>('')
  const [center, setCenter] = useState<string>('')
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'cancel'; id: string | null } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detail, setDetail] = useState<ApplicationDetail | null>(null)
  // Local editing state removed as unused
  const [centerOptions, setCenterOptions] = useState<string[]>([])
  const [exporting, setExporting] = useState(false)
  const [institution, setInstitution] = useState<InstitutionInfo | null>(null)

  const boardOptions = ['Dhaka', 'Rajshahi', 'Chittagong', 'Jessore', 'Comilla', 'Sylhet', 'Barisal', 'Dinajpur', 'Madrasha', 'Technical']

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Narrow optional union filters to their exact types to avoid widening to string
      const examPathParam = (examPath || undefined) as undefined | 'NATIONAL' | 'MADRASHA'
      const mediumParam = (medium || undefined) as undefined | 'Bangla' | 'English' | 'Arabic'
      const statusParam = (status || undefined) as undefined | 'approved' | 'under_review'

      const res = await applicationsApi.list({
        page: 1,
        limit: 50,
        search,
        unitId: unitId || undefined,
        examPath: examPathParam,
        medium: mediumParam,
        board: board || undefined,
        status: statusParam,
        center: center || undefined,
      })
      setRows(res.data)
    } finally {
      setLoading(false)
    }
  }, [search, unitId, examPath, medium, board, status, center])

  useEffect(() => {
    (async () => {
      try {
        // Load current institution info for PDF header
        try {
          const inst = await getMyInstitution()
          setInstitution(inst)
        } catch { /* non-fatal */ }
        const res = await unitsApi.list({ page: 1, limit: 100 })
        const list = (res?.data || []).map((u: { unitId: string; name: string }) => ({ unitId: u.unitId, name: u.name }))
        setUnits(list)
        // Use fixed division options for exam center filter
        setCenterOptions([...DIVISION_OPTIONS])
      } catch { /* ignore */ }
      fetchData()
    })()
  }, [fetchData])

  const openDetail = async (id: string) => {
    setDetailOpen(true)
    setDetailLoading(true)
    try {
      const res = await applicationsApi.getById(id)
      const d = res?.data || null
      setDetail(d)
      // Using detail-only view; no local edit state to set
    } finally {
      setDetailLoading(false)
    }
  }

  const fetchImageAsDataUrl = async (url: string): Promise<string | null> => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      return await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(blob)
      })
    } catch {
      return null
    }
  }

  const handleExportPdf = async () => {
    try {
      setExporting(true)
      // Fetch all pages respecting current filters
      const allRows: ApplicationRow[] = []
      let page = 1
      let totalPages = 1
      do {
        const res = await applicationsApi.list({
          page,
          limit: 100,
          search,
          unitId: unitId || undefined,
          examPath: (examPath || undefined) as undefined | 'NATIONAL' | 'MADRASHA',
          medium: (medium || undefined) as undefined | 'Bangla' | 'English' | 'Arabic',
          board: board || undefined,
          status: (status || undefined) as undefined | 'approved' | 'under_review',
          center: center || undefined,
        })
        allRows.push(...(res?.data || []))
        totalPages = res?.metadata?.totalPages || 1
        page += 1
      } while (page <= totalPages)

      if (allRows.length === 0) {
        toast.info('No data to export', { description: 'Try adjusting filters.' })
        return
      }

      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
      doc.setProperties({
        title: 'Institution Applications Report',
        subject: 'Applications export',
        author: institution?.name ? `${institution.name} - UniForm` : 'UniForm',
        creator: 'UniForm',
      })
      const pageWidth = doc.internal.pageSize.getWidth()
      const marginX = 32
      const Title = institution?.name ? `${institution.name} - Applications Report` : 'Institution Applications Report'
      let titleX = marginX
      // Try to draw logo if available
      if (institution?.logoUrl) {
        try {
          const dataUrl = await fetchImageAsDataUrl(institution.logoUrl)
          if (dataUrl) {
            const fmt: 'JPEG' | 'PNG' = (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) ? 'JPEG' : 'PNG'
            doc.addImage(dataUrl, fmt, marginX, 20, 40, 40)
            titleX = marginX + 52
          }
        } catch { /* ignore logo errors */ }
      }
      doc.setFontSize(16)
      doc.text(Title, titleX, 34)

      // Organized meta panel
      const approvedCount = allRows.filter(r => !!r.reviewedAt).length
      const pendingCount = allRows.length - approvedCount
      const metaRows: Array<[string, string, string, string]> = [
        ['Exported', new Date().toLocaleString(), 'Totals', `${allRows.length} total • ${approvedCount} approved • ${pendingCount} pending`],
        ['Unit', unitId ? (units.find(u => u.unitId === unitId)?.name || unitId) : 'All', 'Status', status || 'All'],
        ['Curriculum', examPath || 'All', 'Medium', medium || 'All'],
        ['Board', board || 'All', 'Center', center || 'All'],
        ['Search', search || '-', 'Institution', institution?.shortName || institution?.name || '-'],
      ]

      // Render meta in two columns using autoTable (theme plain)
      let y = 50
      autoTable(doc, {
        startY: y,
        margin: { left: marginX, right: marginX },
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 1 },
        columnStyles: { 0: { fontStyle: 'bold', textColor: 60 }, 2: { fontStyle: 'bold', textColor: 60 } },
        tableWidth: 'auto',
        head: [],
        body: metaRows,
      })
      // Position table below meta panel using plugin-augmented fields
      type JsPDFWithAutoTable = InstanceType<typeof jsPDF> & {
        lastAutoTable?: { finalY: number }
        autoTable?: { previous?: { finalY: number } }
      }
      const d = doc as JsPDFWithAutoTable
      y = d.lastAutoTable?.finalY ?? d.autoTable?.previous?.finalY ?? 56

      // Define columns with customizable widths and value accessors
      type Col = { key: string; header: string; width?: number; value: (r: ApplicationRow) => string }
      const columns: Col[] = [
        { key: 'id', header: 'App ID', width: 50, value: (r) => r.id },
        { key: 'unit', header: 'Unit', width: 25, value: (r) => r.unit?.name || '-' },
        { key: 'student', header: 'Student', width: 72, value: (r) => r.student?.fullName || '-' },
        { key: 'email', header: 'Email', width: 100, value: (r) => r.student?.email || '-' },
        { key: 'phone', header: 'Phone', width: 52, value: (r) => r.student?.phone || '-' },
        { key: 'center', header: 'Center', width: 50, value: (r) => (r.examCenter || r.centerPreference || '-') as string },
        { key: 'seat', header: 'Seat', width: 50, value: (r) => r.seatNo || '-' },
        { key: 'curric', header: 'Curric', width: 40, value: (r) => r.student?.examPath || '-' },
        { key: 'medium', header: 'Medium', width: 30, value: (r) => r.student?.medium || '-' },
        { key: 'sscRoll', header: 'SSC Roll', width: 32, value: (r) => r.student?.sscRoll || '-' },
        { key: 'sscReg', header: 'SSC Reg', width: 32, value: (r) => r.student?.sscRegistration || '-' },
        { key: 'hscRoll', header: 'HSC Roll', width: 32, value: (r) => r.student?.hscRoll || '-' },
        { key: 'hscReg', header: 'HSC Reg', width: 32, value: (r) => r.student?.hscRegistration || '-' },
        { key: 'sscBd', header: 'SSC Bd', width: 40, value: (r) => r.student?.sscBoard || '-' },
        { key: 'sscYr', header: 'SSC Yr', width: 30, value: (r) => String(r.student?.sscYear ?? '-') },
        { key: 'hscBd', header: 'HSC Bd', width: 40, value: (r) => r.student?.hscBoard || '-' },
        { key: 'hscYr', header: 'HSC Yr', width: 30, value: (r) => String(r.student?.hscYear ?? '-') },
        { key: 'status', header: 'Status', width: 36, value: (r) => (r.reviewedAt ? 'Approved' : 'Pending') },
      ]

      const head = [columns.map((c) => c.header)]
      const body = allRows.map((r) => columns.map((c) => c.value(r)))

      // Compute per-column widths from definitions, distributing any remaining width equally
      const innerWidth = pageWidth - marginX * 2
      const explicitSum = columns.reduce((sum, c) => sum + (c.width ?? 0), 0)
      const remaining = Math.max(0, innerWidth - explicitSum)
      const flexibleCount = columns.filter((c) => !c.width).length
      const flexibleWidth = flexibleCount > 0 ? Math.floor(remaining / flexibleCount) : 0
      const columnStyles: Record<number, { cellWidth: number }> = {}
      columns.forEach((c, i) => {
        const w = c.width ?? flexibleWidth
        columnStyles[i] = { cellWidth: w }
      })

      autoTable(doc, {
        head,
        body,
        startY: y + 6,
        margin: { left: marginX, right: marginX },
        styles: {
          fontSize: 6,
          cellPadding: 1,
          overflow: 'linebreak',
          lineWidth: 0.1,
          minCellHeight: 10,
          cellWidth: 'wrap',
        },
        headStyles: { fillColor: [245, 245, 245], textColor: 20, fontStyle: 'bold', halign: 'center' },
        bodyStyles: { valign: 'middle' },
        alternateRowStyles: { fillColor: [252, 252, 252] },
        tableWidth: innerWidth,
        columnStyles,
      })

      // Add footer page numbers in a second pass
      const total = doc.getNumberOfPages()
      doc.setFontSize(9)
      for (let i = 1; i <= total; i++) {
        doc.setPage(i)
        const footer = `Page ${i} of ${total}`
        const textWidth = doc.getTextWidth(footer)
        doc.text(footer, pageWidth - marginX - textWidth, doc.internal.pageSize.getHeight() - 18)
      }

      const dateStr = new Date().toISOString().substring(0, 10)
      const safeShort = institution?.shortName?.replace(/[^a-z0-9_-]+/gi, '_')
      doc.save(`${safeShort ? `${safeShort}_` : ''}applications_report_${dateStr}.pdf`)
    } catch (e) {
      const err = e as { message?: string }
      toast.error('Failed to export PDF', { description: err?.message || 'Please try again.' })
    } finally {
      setExporting(false)
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
            <Button onClick={handleExportPdf} disabled={exporting} className="bg-gray-900 hover:bg-gray-800">
              {exporting ? 'Exporting...' : 'Download PDF'}
            </Button>
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
            <Select value={status || 'ALL'} onValueChange={(v: string) => setStatus(v === 'ALL' ? '' : (v as 'approved' | 'under_review'))}>
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
            <Select value={examPath || 'ALL'} onValueChange={(v: string) => setExamPath(v === 'ALL' ? '' : (v as 'NATIONAL' | 'MADRASHA'))}>
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
            <Select value={medium || 'ALL'} onValueChange={(v: string) => setMedium(v === 'ALL' ? '' : (v as 'Bangla' | 'English' | 'Arabic'))}>
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
            <Select value={center || 'ALL'} onValueChange={(v: string) => setCenter(v === 'ALL' ? '' : v)}>
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
            {Object.values(
              rows.reduce(
                (acc: Record<string, { unit: { unitId: string; name: string }; items: ApplicationRow[] }>, r) => {
                  const key = r.unit.unitId
                  if (!acc[key]) acc[key] = { unit: r.unit, items: [] }
                  acc[key].items.push(r)
                  return acc
                },
                {}
              )
            ).map((group: { unit: { unitId: string; name: string }; items: ApplicationRow[] }) => (
              <div key={group.unit.unitId} className="py-4">
                <div className="px-4 pb-2 text-gray-900 font-semibold">{group.unit.name}</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applied At</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Exam Center</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.items.map((r) => (
                      <TableRow key={r.id} className="cursor-pointer" onClick={() => openDetail(r.id)}>
                        <TableCell className="text-gray-700">{new Date(r.appliedAt).toLocaleString()}</TableCell>
                        <TableCell className="text-gray-900 font-medium">{r.student.fullName}</TableCell>
                        <TableCell className="text-gray-700">{r.student.email}</TableCell>
                        <TableCell className="text-gray-700">{r.examCenter || r.centerPreference || '-'}</TableCell>
                        <TableCell className="text-gray-700">{r.reviewedAt ? 'Approved' : 'Under Review'}</TableCell>
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
              onClick={() => setConfirmAction({ type: 'cancel', id: detail?.id ?? null })}
              title={detail?.reviewedAt ? 'Already approved' : undefined}
            >
              Cancel Application
            </Button>
            <Button
              className="bg-gray-900 hover:bg-gray-800 disabled:opacity-60"
              disabled={!!detail?.reviewedAt}
              onClick={() => setConfirmAction({ type: 'approve', id: detail?.id ?? null })}
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
                      setDetail((d) => (d ? { ...d, reviewedAt: new Date().toISOString() } : d));
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
                } catch (e: unknown) {
                  const err = e as { response?: { data?: { message?: string } } }
                  const msg = err?.response?.data?.message || 'Action failed';
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

