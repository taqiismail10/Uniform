import ProtectedRoutes from '@/utils/ProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getEligibleInstitutionById, type EligibleInstitution, type EligibleUnit } from '@/api/studentExplore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { applyToUnit } from '@/api/studentApplications'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
// Header is rendered by parent /student layout

export const Route = createFileRoute('/student/institutions/$institutionId')({
  component: () => (
    <ProtectedRoutes role={ROLES.STUDENT}>
      <RouteComponent />
    </ProtectedRoutes>
  ),
})

function RouteComponent() {
  const { institutionId } = useParams({ from: '/student/institutions/$institutionId' })
  const navigate = useNavigate()
  const [inst, setInst] = useState<EligibleInstitution | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState<string | null>(null)
  

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const data = await getEligibleInstitutionById(institutionId)
        setInst(data)
      } finally { setLoading(false) }
    })()
  }, [institutionId])

  

  const doApply = async (unit: EligibleUnit) => {
    setApplying(unit.unitId)
    try {
      await applyToUnit(unit.unitId)
      toast.success('Application submitted', { description: `${unit.name}` })
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } }
      const msg = err?.response?.data?.message || 'Failed to submit application'
      toast.error(msg)
    } finally { setApplying(null) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-gray-700" onClick={() => navigate({ to: '/student/dashboard' })}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Institutions
          </Button>
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">
              {loading ? 'Loading institution...' : (inst ? (inst.shortName ? `${inst.name} (${inst.shortName})` : inst.name) : 'Institution')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-gray-600">Loading...</div>
            ) : !inst ? (
              <div className="py-8 text-gray-600">Institution not found or you are not eligible.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-800">
                <div className="md:col-span-3 flex items-center gap-3">
                  <div className='flex items-center justify-center w-12 h-12 rounded-full shadow-sm p-1'>
                    <img src={inst.logoUrl || '/logo.svg'} alt="Logo" className="h-8 w-8 object-cover" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{inst.name}</div>
                    <div className="text-sm text-gray-600">{inst.shortName || '—'}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Website</div>
                  <div>
                    {inst.website ? (
                      <a className="text-blue-600 hover:underline break-all" href={inst.website.startsWith('http') ? inst.website : `https://${inst.website}`} target="_blank" rel="noreferrer">{inst.website}</a>
                    ) : '—'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div>{inst.type || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Ownership</div>
                  <div>{inst.ownership || '—'}</div>
                </div>
                <div className="md:col-span-3">
                  <div className="text-sm text-gray-500">Address</div>
                  <div>{inst.address || '—'}</div>
                </div>
                <div className="md:col-span-3">
                  <div className="text-sm text-gray-500">Description</div>
                  <div>{inst.description || '—'}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Eligible Units</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-gray-600">Loading units...</div>
            ) : !inst || !inst.units || inst.units.length === 0 ? (
              <div className="py-8 text-gray-600">No eligible units available.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inst.units.map((u) => (
                  <div key={u.unitId} className="border border-gray-200 rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-gray-900 font-medium">{u.name}</div>
                      <Button size="sm" className="bg-gray-900 hover:bg-gray-800" disabled={applying === u.unitId} onClick={() => doApply(u)}>
                        {applying === u.unitId ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                    {u.description ? (
                      <div className="text-sm text-gray-700 mt-1 line-clamp-2">{u.description}</div>
                    ) : null}
                    <div className="text-xs text-gray-600 mt-2">
                      Deadline: {u.applicationDeadline ? new Date(u.applicationDeadline).toLocaleString() : '—'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default RouteComponent

