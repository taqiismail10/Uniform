import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import InstitutionProtectedRoutes from '@/utils/InstitutionProtectedRoutes'
import { InstitutionNavbar } from '@/components/institution/InstitutionNavbar'
import { useState } from 'react'
import { unitsApi, type Stream, type UnitRequirementInput } from '@/api/units'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/institution/units/create')({
  component: () => (
    <InstitutionProtectedRoutes>
      <RouteComponent />
    </InstitutionProtectedRoutes>
  ),
})

function RouteComponent() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('') // datetime-local
  const [maxApplications, setMaxApplications] = useState<string>('')
  const [isActive, setIsActive] = useState(true)
  const [autoClose, setAutoClose] = useState(true)
  const [loading, setLoading] = useState(false)

  const [requirements, setRequirements] = useState<UnitRequirementInput[]>([
    { sscStream: 'SCIENCE', hscStream: 'SCIENCE', minSscGPA: 0, minHscGPA: 0, minCombinedGPA: 0 },
  ])

  const addRequirement = () => {
    setRequirements((prev) => [
      ...prev,
      { sscStream: 'SCIENCE', hscStream: 'SCIENCE', minSscGPA: 0, minHscGPA: 0, minCombinedGPA: 0 },
    ])
  }

  const removeRequirement = (idx: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== idx))
  }

  const updateReq = (idx: number, patch: Partial<UnitRequirementInput>) => {
    setRequirements((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Unit name is required')
      return
    }
    setLoading(true)
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        isActive,
        applicationDeadline: deadline ? new Date(deadline).toISOString() : undefined,
        maxApplications: maxApplications ? Number(maxApplications) : undefined,
        autoCloseAfterDeadline: autoClose,
        requirements: requirements.map((r) => ({
          sscStream: r.sscStream,
          hscStream: r.hscStream,
          minSscGPA: r.minSscGPA === undefined || r.minSscGPA === null ? undefined : Number(r.minSscGPA),
          minHscGPA: r.minHscGPA === undefined || r.minHscGPA === null ? undefined : Number(r.minHscGPA),
          minCombinedGPA: r.minCombinedGPA === undefined || r.minCombinedGPA === null ? undefined : Number(r.minCombinedGPA),
        })),
      }
      const res = await unitsApi.create(payload)
      if (res?.status === 201) {
        toast.success('Unit created successfully')
        navigate({ to: '/institution/dashboard' })
      } else {
        toast.error(res?.message || 'Failed to create unit')
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      const msg = err?.response?.data?.message || 'Failed to create unit'
      toast.error(msg)
      // eslint-disable-next-line no-console
      console.error('Create Unit error:', error)
    } finally {
      setLoading(false)
    }
  }

  const streamOptions: Stream[] = ['SCIENCE', 'ARTS', 'COMMERCE']

  return (
    <div className="min-h-screen bg-gray-50">
      <InstitutionNavbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create Unit</h1>
          <Link to="/institution/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Back to Dashboard</Link>
        </div>

        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Unit Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-gray-700">Unit Name</label>
                  <Input id="name" placeholder="e.g., A-Unit" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="deadline" className="text-sm text-gray-700">Application Deadline</label>
                  <Input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="maxApps" className="text-sm text-gray-700">Max Applications</label>
                  <Input id="maxApps" type="number" min={1} step={1} placeholder="e.g., 5000" value={maxApplications} onChange={(e) => setMaxApplications(e.target.value)} />
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
                <Textarea id="desc" placeholder="Optional details about this unit (e.g., A-Unit for Science)" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">Eligibility Requirements</h2>
                  <Button type="button" variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100" onClick={addRequirement}>
                    <Plus className="h-4 w-4 mr-1" /> Add requirement
                  </Button>
                </div>

                <div className="space-y-3">
                  {requirements.map((req, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-md p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Requirement #{idx + 1}</div>
                        <Button type="button" variant="secondary" className="border border-gray-300 text-gray-800 hover:bg-gray-100" onClick={() => removeRequirement(idx)} disabled={requirements.length === 1}>
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* SSC / Dakhil Section */}
                        <div className="rounded-md border border-gray-200 p-3">
                          <div className="text-sm font-medium text-gray-900 mb-2">SSC / Dakhil</div>
                          <div className="space-y-2">
                            <label className="text-xs text-gray-600">Stream</label>
                            <Select value={req.sscStream} onValueChange={(v: Stream) => updateReq(idx, { sscStream: v })}>
                              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                {streamOptions.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                              </SelectContent>
                            </Select>
                            <label className="text-xs text-gray-600">Min GPA</label>
                            <Input type="number" min={0} max={5} step={0.01} value={req.minSscGPA ?? ''} onChange={(e) => updateReq(idx, { minSscGPA: e.target.value === '' ? null : Number(e.target.value) })} />
                          </div>
                        </div>

                        {/* HSC / Alim Section */}
                        <div className="rounded-md border border-gray-200 p-3">
                          <div className="text-sm font-medium text-gray-900 mb-2">HSC / Alim</div>
                          <div className="space-y-2">
                            <label className="text-xs text-gray-600">Stream</label>
                            <Select value={req.hscStream} onValueChange={(v: Stream) => updateReq(idx, { hscStream: v })}>
                              <SelectTrigger className="w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                {streamOptions.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                              </SelectContent>
                            </Select>
                            <label className="text-xs text-gray-600">Min GPA</label>
                            <Input type="number" min={0} max={5} step={0.01} value={req.minHscGPA ?? ''} onChange={(e) => updateReq(idx, { minHscGPA: e.target.value === '' ? null : Number(e.target.value) })} />
                          </div>
                        </div>

                        {/* Combined GPA Section */}
                        <div className="rounded-md border border-gray-200 p-3">
                          <div className="text-sm font-medium text-gray-900 mb-2">Combined GPA</div>
                          <div className="space-y-2">
                            <label className="text-xs text-gray-600">Min Combined GPA (SSC + HSC)</label>
                            <Input type="number" min={0} max={10} step={0.01} value={req.minCombinedGPA ?? ''} onChange={(e) => updateReq(idx, { minCombinedGPA: e.target.value === '' ? null : Number(e.target.value) })} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={loading} className="bg-gray-900 hover:bg-gray-800">
                  {loading ? 'Creating...' : 'Create Unit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
