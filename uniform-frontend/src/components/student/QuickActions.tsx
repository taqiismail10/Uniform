import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { listMyApplications, type MyApplication } from '@/api/studentApplications'
import { toast } from 'sonner'

export default function QuickActions() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(false)

  const handleAdmitCard = async () => {
    setChecking(true)
    try {
      const apps: MyApplication[] = await listMyApplications()
      const approved = apps.filter(a => !!a.reviewedAt)
      if (approved.length === 1) {
        navigate({ to: '/student/admit/$id', params: { id: approved[0].id }, search: { download: 1 } })
      } else if (approved.length > 1) {
        toast.info('Multiple approved applications found. Pick one to download.')
        navigate({ to: '/student/applications' })
      } else {
        toast.error('No approved application yet', { description: 'You can view status under My Applications.' })
        navigate({ to: '/student/applications' })
      }
    } catch (e) {
      toast.error('Unable to fetch applications')
    } finally {
      setChecking(false)
    }
  }
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Common tasks and actions</p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            onClick={() => navigate({ to: '/student/institutions' })}
          >
            New Application
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            onClick={() => navigate({ to: '/student/applications' })}
          >
            My Applications
          </button>
          <button
            type="button"
            onClick={handleAdmitCard}
            disabled={checking}
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            {checking ? 'Checking…' : 'Download Admit Card'}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            Help & Support
          </button>
        </div>
      </div>
    </div>
  );
}
