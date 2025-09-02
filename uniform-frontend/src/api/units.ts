// uniform-frontend/src/api/units.ts
import api from '@/api/axios'

export type Stream = 'SCIENCE' | 'ARTS' | 'COMMERCE'

export interface UnitRequirementInput {
  sscStream: Stream
  hscStream: Stream
  minSscGPA?: number | null
  minHscGPA?: number | null
  minCombinedGPA?: number | null
  minSscYear?: number | null
  maxSscYear?: number | null
  minHscYear?: number | null
  maxHscYear?: number | null
}

export interface CreateUnitInput {
  name: string
  description?: string | null
  isActive?: boolean
  applicationDeadline?: string | null // ISO string
  maxApplications?: number | null
  autoCloseAfterDeadline?: boolean
  // Unit-level exam details
  examDate?: string | null
  examTime?: string | null
  examCenter?: string | null
  requirements?: UnitRequirementInput[]
}

export interface UnitRequirement {
  sscStream?: Stream
  hscStream?: Stream
  minSscGPA?: number | null
  minHscGPA?: number | null
  minCombinedGPA?: number | null
  minSscYear?: number | null
  maxSscYear?: number | null
  minHscYear?: number | null
  maxHscYear?: number | null
}

export interface UnitDetail {
  unitId: string
  name: string
  description?: string | null
  isActive?: boolean
  applicationDeadline?: string | null
  maxApplications?: number | null
  autoCloseAfterDeadline?: boolean
  examDate?: string | null
  examTime?: string | null
  examCenter?: string | null
  requirements?: UnitRequirement[]
  _count?: { applications?: number }
}

export const unitsApi = {
  list: async (params?: { page?: number; limit?: number }) => {
    const res = await api.get('/admin/units', { params })
    return res.data as { status: number; data: any[]; metadata?: any }
  },
  getById: async (unitId: string) => {
    const res = await api.get(`/admin/units/${unitId}`)
    return res.data as { status: number; data: UnitDetail }
  },
  create: async (payload: CreateUnitInput) => {
    const res = await api.post('/admin/units', payload)
    return res.data
  },
  update: async (unitId: string, payload: Partial<CreateUnitInput>) => {
    const res = await api.put(`/admin/units/${unitId}`, payload)
    return res.data
  },
  setExamDetails: async (unitId: string, payload: { examDate?: string | Date | null; examTime?: string | null; examCenter?: string | null }) => {
    const res = await api.put(`/admin/units/${unitId}/exam`, payload)
    return res.data
  },
  remove: async (unitId: string) => {
    const res = await api.delete(`/admin/units/${unitId}`)
    return res.data
  },
}
