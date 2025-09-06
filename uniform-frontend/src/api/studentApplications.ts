import api from '@/api/axios'

export const applyToUnit = async (unitId: string, centerPreference?: string) => {
  const payload: { unitId: string; centerPreference?: string } = { unitId }
  if (centerPreference) payload.centerPreference = centerPreference
  const res = await api.post('/applications', payload)
  return res.data as { status: number; message?: string; application?: { id: string } }
}

export type MyApplication = {
  id: string
  unitId?: string
  appliedAt: string
  reviewedAt?: string | null
  unit: { name: string; examDate?: string | null; examTime?: string | null; examCenter?: string | null }
  institution: { name: string; logoUrl?: string | null }
  // Exam details
  seatNo?: string | null
  examDate?: string | null
  examTime?: string | null
  examCenter?: string | null
  centerPreference?: string | null
}

export const listMyApplications = async (): Promise<MyApplication[]> => {
  const res = await api.get('/applications')
  const data = res.data as { status: number; applications?: MyApplication[] }
  if (data?.status === 200 && Array.isArray(data.applications)) return data.applications
  return []
}

export const deleteApplication = async (id: string): Promise<boolean> => {
  const res = await api.delete(`/applications/${id}`)
  return res.data?.status === 200
}
