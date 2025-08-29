import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import InstitutionProtectedRoutes from '@/utils/InstitutionProtectedRoutes'
import { InstitutionNavbar } from '@/components/institution/InstitutionNavbar'
import { useEffect, useState } from 'react'
import { unitsApi } from '@/api/units'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

type UnitDetail = {
  unitId: string
  name: string
  description?: string | null
  isActive?: boolean
  applicationDeadline?: string | null
  maxApplications?: number | null
  autoCloseAfterDeadline?: boolean
}

export const Route = createFileRoute('/institution/units/$unitId/edit')({
  component: () => (
    <InstitutionProtectedRoutes>
      <RouteComponent />
    </InstitutionProtectedRoutes>
  ),
})

function RouteComponent() {
  const navigate = useNavigate()
  const { unitId } = useParams({ from: '/institution/units/$unitId/edit' })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('') // datetime-local
  const [maxApplications, setMaxApplications] = useState<string>('')
  const [isActive, setIsActive] = useState(true)
  const [autoClose, setAutoClose] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await unitsApi.getById(unitId)
        const u = res.data as UnitDetail
        setName(u.name)
        setDescription(u.description || '')
        setIsActive(Boolean(u.isActive))
        setAutoClose(Boolean(u.autoCloseAfterDeadline))
        setMaxApplications(u.maxApplications ? String(u.maxApplications) : '')
        setDeadline(u.applicationDeadline ? new Date(u.applicationDeadline).toISOString().slice(0,16) : '')
      } finally {
        setLoading(false)
      }
    })()
  }, [unitId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Unit name is required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        isActive,
        applicationDeadline: deadline ? new Date(deadline).toISOString() : undefined,
        maxApplications: maxApplications ? Number(maxApplications) : undefined,
        autoCloseAfterDeadline: autoClose,
      }
      const res = await unitsApi.update(unitId, payload)
      if (res?.status === 200) {
        toast.success('Unit updated')
        navigate({ to: '/institution/units/$unitId', params: { unitId }, replace: true })
      } else {
        toast.error(res?.message || 'Update failed')
      }
    } catch (error) {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InstitutionNavbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Unit</h1>
          <Button variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100" onClick={() => navigate({ to: '/institution/units/$unitId', params: { unitId } })}>Cancel</Button>
        </div>
        {loading ? (
          <div className="py-12 text-center text-gray-600">Loading...</div>
        ) : (
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Unit Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm text-gray-700">Unit Name</label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="deadline" className="text-sm text-gray-700">Application Deadline</label>
                    <Input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="maxApps" className="text-sm text-gray-700">Max Applications</label>
                    <Input id="maxApps" type="number" min={1} step={1} value={maxApplications} onChange={(e) => setMaxApplications(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="h-4 w-4" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                      Active
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" className="h-4 w-4" checked={autoClose} onChange={(e) => setAutoClose(e.target.checked)} />
                      Auto close after deadline
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="desc" className="text-sm text-gray-700">Description</label>
                  <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="pt-2">
                  <Button type="submit" disabled={saving} className="bg-gray-900 hover:bg-gray-800">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

