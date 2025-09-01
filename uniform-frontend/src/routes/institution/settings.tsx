import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { getInstitutionAdminProfile, updateInstitutionAdminEmail, getMyInstitution, updateMyInstitution } from '@/api/institutionAdmin'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '@/context/admin/useAuth'
// Layout and protection are provided by parent /institution route

export const Route = createFileRoute('/institution/settings')({
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const [email, setEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [instShortName, setInstShortName] = useState('')
  const [savingInst, setSavingInst] = useState(false)
  const { user, login } = useAuth()

  useEffect(() => {
    (async () => {
      try {
        const p = await getInstitutionAdminProfile()
        setEmail(p.email)
        try {
          const inst = await getMyInstitution()
          setInstShortName(inst.shortName || '')
        } catch {}
      } catch {}
    })()
  }, [])

  return (
    <div className="max-w-3xl mx-auto py-0 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="grid gap-6">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Institution</h2>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shortName" className="text-right">Short Name</Label>
              <Input id="shortName" className="col-span-3" placeholder="e.g., DU, BUET" value={instShortName} onChange={(e) => setInstShortName(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                className="border border-gray-300 text-gray-800 hover:bg-gray-100"
                onClick={async () => {
                  try {
                    setSavingInst(true)
                    await updateMyInstitution({ shortName: instShortName })
                    toast.success('Institution short name updated')
                  } catch (e: any) {
                    const msg = e?.response?.data?.message || 'Failed to update institution'
                    toast.error(msg)
                  } finally { setSavingInst(false) }
                }}
                disabled={savingInst}
              >{savingInst ? 'Saving…' : 'Save Institution'}</Button>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Account Email</h2>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={async () => {
                  try {
                    setSavingEmail(true)
                    const updated = await updateInstitutionAdminEmail(email)
                    if (user) login({ ...user, email: updated.email })
                    toast.success('Email updated')
                  } catch (e: any) {
                    const msg = e?.response?.data?.message || 'Failed to update email'
                    toast.error(msg)
                  } finally { setSavingEmail(false) }
                }}
                disabled={savingEmail || !email.trim()}
              >{savingEmail ? 'Saving...' : 'Save Email'}</Button>
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Change Password</h2>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="oldPassword" className="text-right">Current Password</Label>
              <Input id="oldPassword" type="password" className="col-span-3" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newPassword" className="text-right">New Password</Label>
              <Input id="newPassword" type="password" className="col-span-3" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" className="col-span-3" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={async () => {
                  if (!oldPassword.trim() || !newPassword.trim()) { toast.error('Please fill all fields'); return }
                  if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
                  try {
                    setSavingPassword(true)
                    await fetch('/api/admin/update-password', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: localStorage.getItem('institutionAccessToken') || '' }, body: JSON.stringify({ oldPassword, newPassword }) })
                    setOldPassword(''); setNewPassword(''); setConfirmPassword('')
                    toast.success('Password updated')
                  } catch (e: any) {
                    const msg = e?.response?.data?.message || 'Failed to update password'
                    toast.error(msg)
                  } finally { setSavingPassword(false) }
                }}
                disabled={savingPassword}
              >{savingPassword ? 'Updating...' : 'Update Password'}</Button>
            </div>
          </section>
        </div>
    </div>
  )
}
