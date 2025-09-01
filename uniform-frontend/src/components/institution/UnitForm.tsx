import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { CreateUnitInput, Stream, UnitRequirementInput } from '@/api/units'

export type UnitFormInitial = {
  name?: string
  description?: string | null
  isActive?: boolean
  applicationDeadline?: string | null // ISO string
  maxApplications?: number | null
  autoCloseAfterDeadline?: boolean
  requirements?: UnitRequirementInput[]
}

type UnitFormProps = {
  mode: 'create' | 'edit'
  initial?: UnitFormInitial
  submitLabel?: string
  submittingLabel?: string
  onSubmit: (payload: CreateUnitInput) => Promise<{ status: number; message?: string; data?: any }>
  onSuccess?: (res: { status: number; message?: string; data?: any }) => void
}

export default function UnitForm({ mode, initial, submitLabel, submittingLabel, onSubmit, onSuccess }: UnitFormProps) {
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [deadline, setDeadline] = useState<string>('') // datetime-local
  const [maxApplications, setMaxApplications] = useState<string>('')
  const [isActive, setIsActive] = useState<boolean>(true)
  const [autoClose, setAutoClose] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)

  const [requirements, setRequirements] = useState<UnitRequirementInput[]>([
    { sscStream: 'SCIENCE', hscStream: 'SCIENCE', minSscGPA: 0, minHscGPA: 0, minCombinedGPA: 0 },
  ])

  // derive initial state from props
  useEffect(() => {
    if (!initial) return
    setName(initial.name ?? '')
    setDescription(initial.description ?? '')
    setDeadline(initial.applicationDeadline ? new Date(initial.applicationDeadline).toISOString().slice(0, 16) : '')
    setMaxApplications(
      typeof initial.maxApplications === 'number' && !Number.isNaN(initial.maxApplications)
        ? String(initial.maxApplications)
        : ''
    )
    setIsActive(initial.isActive ?? true)
    setAutoClose(initial.autoCloseAfterDeadline ?? true)
    const reqs: UnitRequirementInput[] = (initial.requirements || []).map((r: UnitRequirementInput) => ({
      sscStream: r.sscStream ?? 'SCIENCE',
      hscStream: r.hscStream ?? 'SCIENCE',
      minSscGPA: r.minSscGPA ?? null,
      minHscGPA: r.minHscGPA ?? null,
      minCombinedGPA: r.minCombinedGPA ?? null,
    }))
    setRequirements(reqs.length ? reqs : [{ sscStream: 'SCIENCE', hscStream: 'SCIENCE', minSscGPA: 0, minHscGPA: 0, minCombinedGPA: 0 }])
  }, [initial])

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

  const streamOptions: Stream[] = useMemo(() => ['SCIENCE', 'ARTS', 'COMMERCE'], [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Unit name is required')
      return
    }

    // Basic client-side validations to reduce backend rejects
    if (maxApplications) {
      const n = Number(maxApplications)
      if (!Number.isFinite(n) || n < 1) {
        toast.error('Max Applications must be at least 1')
        return
      }
    }

    // Prevent duplicate stream combinations in a single submission
    const combos = new Set<string>()
    for (const r of requirements) {
      const key = `${r.sscStream}-${r.hscStream}`
      if (combos.has(key)) {
        toast.error('Duplicate stream combinations are not allowed')
        return
      }
      combos.add(key)
    }
    setSaving(true)
    try {
      const payload: CreateUnitInput = {
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
      const res = await onSubmit(payload)
      if (res?.status === 200 || res?.status === 201) {
        toast.success(mode === 'create' ? 'Unit created successfully' : 'Unit updated')
        onSuccess?.(res)
      } else {
        const fallback = mode === 'create' ? 'Failed to create unit' : 'Update failed'
        // Try to surface validation errors if present
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const maybeErrors = (res as any)?.errors
        const msg = res?.message || (Array.isArray(maybeErrors) ? maybeErrors.join(', ') : fallback)
        toast.error(msg)
      }
    } catch (error: unknown) {
      // Try to extract backend validation errors
      const err = error as { response?: { data?: { message?: string; errors?: unknown } } }
      const data = err?.response?.data
      let msg = data?.message || (mode === 'create' ? 'Failed to create unit' : 'Update failed')
      const errors = data?.errors
      if (errors) {
        if (Array.isArray(errors)) {
          msg = errors.map((e) => String(e)).join(', ')
        } else if (typeof errors === 'object') {
          // Format vine error object map into a readable line
          msg = Object.entries(errors as Record<string, unknown>)
            .map(([k, v]) => {
              if (Array.isArray(v)) return `${k}: ${v.join(', ')}`
              return `${k}: ${String(v)}`
            })
            .join(' | ')
        }
      }
      toast.error(msg)
      // eslint-disable-next-line no-console
      console.error(mode === 'create' ? 'Create Unit error:' : 'Update Unit error:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
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
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input id="isActive" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
          </div>
          <div className="flex items-center gap-2">
            <input id="autoClose" type="checkbox" checked={autoClose} onChange={(e) => setAutoClose(e.target.checked)} />
            <label htmlFor="autoClose" className="text-sm text-gray-700">Auto close after deadline</label>
          </div>
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
        <Button type="submit" disabled={saving} className="bg-gray-900 hover:bg-gray-800">
          {saving ? (submittingLabel ?? (mode === 'create' ? 'Creating...' : 'Updating...')) : (submitLabel ?? (mode === 'create' ? 'Create Unit' : 'Update Unit'))}
        </Button>
      </div>
    </form>
  )
}
