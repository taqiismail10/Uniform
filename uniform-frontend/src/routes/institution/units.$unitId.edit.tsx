import { createFileRoute, useParams, useNavigate, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { unitsApi } from '@/api/units'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import UnitForm, { type UnitFormInitial } from '@/components/institution/UnitForm'
// Layout and protection are provided by parent /institution route

export const Route = createFileRoute('/institution/units/$unitId/edit')({
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const { unitId } = useParams({ from: '/institution/units/$unitId/edit' })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [initial, setInitial] = useState<UnitFormInitial | null>(null)

  // Ensure no stale Radix artifacts are blocking interactions
  useEffect(() => {
    try {
      document.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.removeAttribute('aria-hidden'))
      document.querySelectorAll('[inert]').forEach((el) => el.removeAttribute('inert'))
      if (document.body) document.body.style.pointerEvents = ''
    } catch { /* noop */ }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const res = await unitsApi.getById(unitId)
        const u = res?.data
        if (!u) throw new Error('Not found')
        const toNum = (v: unknown) => {
          if (v === null || v === undefined) return null
          const n = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? v : NaN
          return Number.isFinite(n) ? (n as number) : null
        }

        const init: UnitFormInitial = {
          name: u.name ?? '',
          description: u.description ?? '',
          applicationDeadline: u.applicationDeadline ?? null,
          maxApplications: typeof u.maxApplications === 'number' ? u.maxApplications : null,
          isActive: !!u.isActive,
          autoCloseAfterDeadline: !!u.autoCloseAfterDeadline,
          requirements: (u.requirements ?? []).map((r) => {
            // Support legacy single-year fields (sscYear/hscYear) by hydrating min/max
            const rawSscSingle = (r as any).sscYear
            const rawHscSingle = (r as any).hscYear
            const rawMinSsc = (r as any).minSscYear ?? rawSscSingle
            const rawMaxSsc = (r as any).maxSscYear ?? rawSscSingle
            const rawMinHsc = (r as any).minHscYear ?? rawHscSingle
            const rawMaxHsc = (r as any).maxHscYear ?? rawHscSingle

            return {
              sscStream: r.sscStream ?? 'SCIENCE',
              hscStream: r.hscStream ?? 'SCIENCE',
              minSscGPA: r.minSscGPA ?? null,
              minHscGPA: r.minHscGPA ?? null,
              minCombinedGPA: r.minCombinedGPA ?? null,
              minSscYear: toNum(rawMinSsc),
              maxSscYear: toNum(rawMaxSsc),
              minHscYear: toNum(rawMinHsc),
              maxHscYear: toNum(rawMaxHsc),
            }
          }),
        }
        setInitial(init)
      } catch {
        toast.error('Failed to load unit')
      } finally {
        setLoading(false)
      }
    })()
  }, [unitId])

  return (
    <div className="max-w-5xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-gray-700" onClick={() => navigate({ to: '/institution/units/$unitId', params: { unitId } })}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Unit</h1>
        </div>
        <Link to="/institution/units" className="text-sm text-gray-600 hover:text-gray-900">Back to Units</Link>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Unit Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-gray-600">Loading...</div>
          ) : initial ? (
            <UnitForm
              mode="edit"
              initial={initial}
              submitLabel="Update Unit"
              submittingLabel="Updating..."
              onSubmit={(payload) => unitsApi.update(unitId, payload)}
              onSuccess={() => navigate({ to: '/institution/units/$unitId', params: { unitId } })}
            />
          ) : (
            <div className="py-12 text-center text-gray-600">Unit not found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default RouteComponent
