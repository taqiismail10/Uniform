// uniform-frontend/src/api/applications.ts
import api from '@/api/axios'

export interface ApplicationRow {
  id: string
  appliedAt: string
  reviewedAt?: string | null
  student: {
    studentId: string;
    fullName: string;
    email: string;
    phone?: string | null;
    examPath?: 'NATIONAL' | 'MADRASHA';
    medium?: 'Bangla' | 'English' | 'Arabic';
    sscRoll?: string | null;
    sscRegistration?: string | null;
    hscRoll?: string | null;
    hscRegistration?: string | null;
    sscBoard?: string | null;
    hscBoard?: string | null;
    sscYear?: number | null;
    hscYear?: number | null;
  }
  unit: { unitId: string; name: string }
  seatNo?: string | null
  examDate?: string | null
  examTime?: string | null
  examCenter?: string | null
  centerPreference?: string | null
}

export interface ApplicationDetail {
  id: string
  appliedAt: string
  reviewedAt?: string | null
  seatNo?: string | null
  examDate?: string | null
  examTime?: string | null
  examCenter?: string | null
  centerPreference?: string | null
  institution?: { institutionId: string; name: string; shortName?: string | null }
  unit?: { unitId: string; name: string; description?: string | null }
  student?: {
    studentId: string
    fullName?: string | null
    email?: string | null
    phone?: string | null
    examPath?: 'NATIONAL' | 'MADRASHA' | ''
    medium?: 'Bangla' | 'English' | 'Arabic' | ''
    sscStream?: 'SCIENCE' | 'ARTS' | 'COMMERCE' | null
    hscStream?: 'SCIENCE' | 'ARTS' | 'COMMERCE' | null
    sscGpa?: number | null
    hscGpa?: number | null
    sscBoard?: string | null
    hscBoard?: string | null
    sscYear?: number | null
    hscYear?: number | null
    dakhilGpa?: number | null
    alimGpa?: number | null
    dakhilBoard?: string | null
    alimBoard?: string | null
    dakhilYear?: number | null
    alimYear?: number | null
    address?: string | null
    dob?: string | null
  }
}

export const applicationsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string; unitId?: string; examPath?: 'NATIONAL' | 'MADRASHA'; medium?: 'Bangla' | 'English' | 'Arabic'; board?: string; status?: 'approved' | 'under_review'; center?: string }) => {
    const res = await api.get('/admin/applications', { params })
    return res.data as { status: number; data: ApplicationRow[]; metadata: { total: number; totalPages: number; currentPage: number; currentLimit: number } }
  },
  getById: async (id: string) => {
    const res = await api.get(`/admin/applications/${id}`)
    return res.data as { status: number; data: ApplicationDetail }
  },
  approve: async (id: string, notes?: string) => {
    const res = await api.put(`/admin/applications/${id}/approve`, notes ? { notes } : undefined)
    return res.data as { status: number; message?: string }
  },
  setExamDetails: async (id: string, payload: { seatNo?: string; examDate?: string | Date | null; examTime?: string | null; examCenter?: string | null }) => {
    const res = await api.put(`/admin/applications/${id}/exam`, payload)
    return res.data as { status: number; message?: string }
  },
  remove: async (id: string) => {
    const res = await api.delete(`/admin/applications/${id}`)
    return res.data as { status: number; message?: string }
  },
}
