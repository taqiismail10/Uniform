// uniform-frontend/src/api/admin/institutionStats.ts
import api from '@/api/axios'

export interface InstitutionStats {
  totalUnits: number
  totalApplications: number
  appliedStudents: number
}

export const getInstitutionStats = async (): Promise<InstitutionStats> => {
  const res = await api.get('/admin/stats')
  return res.data.data as InstitutionStats
}

