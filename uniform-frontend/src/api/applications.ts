// uniform-frontend/src/api/applications.ts
import api from '@/api/axios'

export interface ApplicationRow {
  id: string
  appliedAt: string
  reviewedAt?: string | null
  student: { studentId: string; fullName: string; email: string; examPath?: 'NATIONAL' | 'MADRASHA'; medium?: 'Bangla' | 'English' | 'Arabic'; sscBoard?: string | null; hscBoard?: string | null }
  unit: { unitId: string; name: string }
}

export const applicationsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string; unitId?: string; examPath?: 'NATIONAL' | 'MADRASHA'; medium?: 'Bangla' | 'English' | 'Arabic'; board?: string; status?: 'approved' | 'under_review' }) => {
    const res = await api.get('/admin/applications', { params })
    return res.data as { status: number; data: ApplicationRow[]; metadata: { total: number; totalPages: number; currentPage: number; currentLimit: number } }
  },
  getById: async (id: string) => {
    const res = await api.get(`/admin/applications/${id}`)
    return res.data as { status: number; data: any }
  },
  approve: async (id: string, notes?: string) => {
    const res = await api.put(`/admin/applications/${id}/approve`, notes ? { notes } : undefined)
    return res.data as { status: number; message?: string }
  },
  remove: async (id: string) => {
    const res = await api.delete(`/admin/applications/${id}`)
    return res.data as { status: number; message?: string }
  },
}
