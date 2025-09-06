import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getInstitutionStats, type InstitutionStats } from '@/api/admin/institutionStats'
import { getMyInstitution, type InstitutionInfo } from '@/api/institutionAdmin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
// Layout and protection are provided by parent /institution route

export const Route = createFileRoute('/institution/dashboard')({
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const [stats, setStats] = useState<InstitutionStats | null>(null)
  const [inst, setInst] = useState<InstitutionInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const [s, i] = await Promise.all([getInstitutionStats(), getMyInstitution()])
        setStats(s)
        setInst(i)
      } finally { setLoading(false) }
    })()
  }, [])

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Institution Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link to="/institution/units"><Button className="bg-gray-900 hover:bg-gray-800">Manage Units</Button></Link>
            <Link to="/institution/applications"><Button variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100">View Applications</Button></Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-gray-200">
            <CardHeader><CardTitle className="text-sm text-gray-500">Units</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-gray-900">{stats?.totalUnits ?? (loading ? '—' : 0)}</div></CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader><CardTitle className="text-sm text-gray-500">Applications</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-gray-900">{stats?.totalApplications ?? (loading ? '—' : 0)}</div></CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardHeader><CardTitle className="text-sm text-gray-500">Applicants</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-gray-900">{stats?.appliedStudents ?? (loading ? '—' : 0)}</div></CardContent>
          </Card>
        </div>

        {/* Institution Info */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Institution Information</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-gray-600">Loading...</div>
            ) : !inst ? (
              <div className="py-8 text-gray-600">Failed to load institution info.</div>
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
                  <div className="text-sm text-gray-500">Email</div>
                  <div>{inst.email || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div>{inst.phone || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Website</div>
                  <div>
                    {inst.website ? (
                      <a
                        className="text-blue-600 hover:underline break-all"
                        href={inst.website.startsWith('http') ? inst.website : `https://${inst.website}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Visit ${inst.name} website`}
                      >
                        {inst.website}
                      </a>
                    ) : (
                      '—'
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div>{inst.address || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Established</div>
                  <div>{inst.establishedYear ?? '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Ownership</div>
                  <div>{inst.ownership || '—'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Type</div>
                  <div>{inst.type || '—'}</div>
                </div>
                <div className="md:col-span-3">
                  <div className="text-sm text-gray-500">Description</div>
                  <div>{inst.description || '—'}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
