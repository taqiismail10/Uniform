// uniform-frontend/src/api/applications.ts
import api from '@/api/axios'

export interface ApplicationRow {
  id: string
  appliedAt: string
  student: { studentId: string; fullName: string; email: string }
  unit: { unitId: string; name: string }
}

export const applicationsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }) => {
    const res = await api.get('/admin/applications', { params })
    return res.data as { status: number; data: ApplicationRow[]; metadata: { total: number; totalPages: number; currentPage: number; currentLimit: number } }
  },
}

