import api from '@/api/axios'

export interface EligibleUnit {
  unitId: string
  name: string
  description?: string | null
  applicationDeadline?: string | null
  isActive?: boolean
  eligible?: boolean
}

export interface EligibleInstitution {
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
  units: EligibleUnit[]
}

export const getEligibleInstitutions = async (): Promise<EligibleInstitution[]> => {
  try {
    const res = await api.get('/institutions/eligible')
    if (res.data?.status === 200) return res.data.data as EligibleInstitution[]
    return []
  } catch (e) {
    return []
  }
}

export const getEligibleInstitutionById = async (
  institutionId: string,
): Promise<EligibleInstitution | null> => {
  try {
    const res = await api.get(`/institutions/${institutionId}/eligible`)
    if (res.data?.status === 200) return res.data.data as EligibleInstitution
    return null
  } catch (e) {
    return null
  }
}
