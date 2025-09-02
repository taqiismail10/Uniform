import api from '@/api/axios'

export const applyToUnit = async (unitId: string) => {
  const res = await api.post('/applications', { unitId })
  return res.data
}

export type MyApplication = {
  id: string
  appliedAt: string
  reviewedAt?: string | null
  unit: { name: string }
  institution: { name: string; logoUrl?: string | null }
}

export const listMyApplications = async (): Promise<MyApplication[]> => {
  const res = await api.get('/applications')
  if (res.data?.status === 200) return res.data.applications as MyApplication[]
  return []
}

export const deleteApplication = async (id: string): Promise<boolean> => {
  const res = await api.delete(`/applications/${id}`)
  return res.data?.status === 200
}
