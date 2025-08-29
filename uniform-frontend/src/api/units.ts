// uniform-frontend/src/api/units.ts
import api from '@/api/axios'

export type Stream = 'SCIENCE' | 'ARTS' | 'COMMERCE'

export interface UnitRequirementInput {
  sscStream: Stream
  hscStream: Stream
  minSscGPA?: number | null
  minHscGPA?: number | null
  minCombinedGPA?: number | null
}

export interface CreateUnitInput {
  name: string
  description?: string | null
  isActive?: boolean
  applicationDeadline?: string | null // ISO string
  maxApplications?: number | null
  autoCloseAfterDeadline?: boolean
  requirements?: UnitRequirementInput[]
}

export const unitsApi = {
  list: async (params?: { page?: number; limit?: number }) => {
    const res = await api.get('/admin/units', { params })
    return res.data as { status: number; data: any[]; metadata?: any }
  },
  getById: async (unitId: string) => {
    const res = await api.get(`/admin/units/${unitId}`)
    return res.data as { status: number; data: any }
  },
  create: async (payload: CreateUnitInput) => {
    const res = await api.post('/admin/units', payload)
    return res.data
  },
  update: async (unitId: string, payload: Partial<CreateUnitInput>) => {
    const res = await api.put(`/admin/units/${unitId}`, payload)
    return res.data
  },
  remove: async (unitId: string) => {
    const res = await api.delete(`/admin/units/${unitId}`)
    return res.data
  },
}
