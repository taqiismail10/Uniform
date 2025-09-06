import api from '@/api/axios'

export interface InstitutionDetail {
  institutionId: string
  name: string
  shortName?: string | null
  website?: string | null
  description?: string | null
  address?: string | null
  type?: string | null
  ownership?: string | null
  establishedYear?: number | null
  logoUrl?: string | null
  units: Array<{ unitId: string; name: string; description?: string | null; applicationDeadline?: string | null; isActive?: boolean }>
}

export const getEligibleInstitutionById = async (institutionId: string): Promise<InstitutionDetail | null> => {
  try {
    const res = await api.get(`/institutions/${institutionId}/eligible`)
    if (res.data?.status === 200) return res.data.data as InstitutionDetail
    return null
  } catch {
    return null
  }
}

