// uniform-frontend/src/routes/admin/settings.tsx

import AdminProtectedRoutes from '@/utils/AdminProtectedRoutes'
import { ROLES } from '@/utils/role'
import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { adminApi } from '@/api/admin/adminApi'
import { toast } from 'sonner'

export const Route = createFileRoute('/admin/settings')({
  component: () => (
    <AdminProtectedRoutes role={ROLES.ADMIN}>
      <RouteComponent />
    </AdminProtectedRoutes>
  ),
})

function RouteComponent() {
  const navigate = useNavigate()
  // Removed unused profile state to avoid TS unused variable error
  const [email, setEmail] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const p = await adminApi.getProfile()
        if (p) setEmail(p.email)
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  const onTabChange = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        navigate({ to: '/admin/dashboard' })
        break
      case 'institutions':
        navigate({ to: '/admin/institutions' })
        break
      case 'admins':
        navigate({ to: '/admin/admins' })
        break
      case 'visualization':
        navigate({ to: '/admin/visualization' })
        break
      default:
        navigate({ to: '/admin/dashboard' })
    }
  }

  return (
    <AdminLayout activeTab={'settings'} onTabChange={onTabChange}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={async () => {
                  try {
                    setSavingEmail(true)
                    await adminApi.updateSystemAdminEmail(email)
                    toast.success('Email updated')
                  } catch (e: unknown) {
                    const err = e as { response?: { data?: { message?: string } } }
                    const msg = err?.response?.data?.message || 'Failed to update email'
                    toast.error(msg)
                  } finally { setSavingEmail(false) }
                }}
                disabled={savingEmail || !email.trim()}
              >{savingEmail ? 'Saving...' : 'Save Email'}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
                    if (!oldPassword.trim() || !newPassword.trim()) { toast.error('Please fill all fields'); return; }
                    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
                    try {
                      setSavingPassword(true)
                      await adminApi.updateSystemAdminPassword({ oldPassword, newPassword })
                      setOldPassword(''); setNewPassword(''); setConfirmPassword('')
                      toast.success('Password updated')
                    } catch (e: unknown) {
                      const err = e as { response?: { data?: { message?: string } } }
                      const msg = err?.response?.data?.message || 'Failed to update password'
                      toast.error(msg)
                    } finally { setSavingPassword(false) }
                  }}
                  disabled={savingPassword}
                >{savingPassword ? 'Updating...' : 'Update Password'}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}


