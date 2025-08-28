// uniform-frontend/src/routes/admin/institutions.$institutionId.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '@/api/admin/adminApi'
import type { Institution } from '@/types/admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Local categories list (kept in sync with CreateInstitutionDialog)
const INSTITUTION_CATEGORIES = [
  'Public',
  'Private',
  'Engineering',
  'Medical',
  'Science & Technology',
  'Agriculture',
  'Arts & Humanities',
  'Business',
  'Law',
  'Education',
  'Vocational',
  'Community College',
  'Research Institute',
]

export const Route = createFileRoute('/admin/institutions/$institutionId')({
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const navigate = useNavigate()
  const params = Route.useParams() as { institutionId: string }
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  // Edit form state
  const [form, setForm] = useState({
    name: '',
    categoryName: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    establishedYear: '',
    logoUrl: '',
  })

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const data = await adminApi.getInstitutionById(params.institutionId)
        setInstitution(data)
        setForm({
          name: data.name ?? '',
          categoryName: data.InstitutionCategory?.name ?? '',
          description: data.description ?? '',
          address: data.address ?? '',
          phone: data.phone ?? '',
          email: data.email ?? '',
          website: data.website ?? '',
          establishedYear: data.establishedYear?.toString() ?? '',
          logoUrl: data.logoUrl ?? '',
        })
      } catch (e) {
        toast.error('Failed to load institution')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [params.institutionId])

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required')
      return
    }
    try {
      setSaving(true)
      const payload = {
        name: form.name.trim(),
        categoryName: form.categoryName?.trim() || undefined,
        description: form.description?.trim() || undefined,
        address: form.address?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        email: form.email?.trim() || undefined,
        website: form.website?.trim() || undefined,
        establishedYear:
          form.establishedYear && !Number.isNaN(Number(form.establishedYear))
            ? Number(form.establishedYear)
            : undefined,
        logoUrl: form.logoUrl?.trim() || undefined,
      }
      const updated = await adminApi.updateInstitution(params.institutionId, payload)
      setInstitution(updated)
      toast.success('Institution updated')
    } catch (e: any) {
      if (e?.response?.data?.errors) {
        const first = e.response.data.errors[0]
        toast.error(first?.message || 'Validation failed')
      } else {
        toast.error('Failed to update institution')
      }
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Institution Details</h1>
          <p className="text-gray-500">View and update institution information</p>
        </div>
        <Button variant="outline" onClick={() => navigate({ to: '/admin/institutions' })}>
          Back to list
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{institution?.name || 'Loading...'}</CardTitle>
          <CardDescription>
            ID: {params.institutionId}
            {institution?.createdAt ? (
              <>
                {' '}• Created {new Date(institution.createdAt).toLocaleDateString()}
              </>
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading institution...</div>
          ) : (
            <div className="grid gap-4 max-w-3xl">
              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              {/* Category */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select
                  value={form.categoryName}
                  onValueChange={(v) => setForm((f) => ({ ...f, categoryName: v }))}
                >
                  <SelectTrigger id="category" className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {INSTITUTION_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Description */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">Description</Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              {/* Address */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input
                  id="address"
                  className="col-span-3"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
              </div>
              {/* Phone */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input
                  id="phone"
                  className="col-span-3"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              {/* Website */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">Website</Label>
                <Input
                  id="website"
                  type="url"
                  className="col-span-3"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                />
              </div>
              {/* Established */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="established" className="text-right">Established</Label>
                <Input
                  id="established"
                  type="number"
                  className="col-span-3"
                  min={1800}
                  max={currentYear}
                  value={form.establishedYear}
                  onChange={(e) => setForm((f) => ({ ...f, establishedYear: e.target.value }))}
                />
              </div>
              {/* Logo URL */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="logo" className="text-right">Logo URL</Label>
                <Input
                  id="logo"
                  type="url"
                  className="col-span-3"
                  value={form.logoUrl}
                  onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => navigate({ to: '/admin/institutions' })}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

