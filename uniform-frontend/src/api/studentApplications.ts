import api from '@/api/axios'

export const applyToUnit = async (unitId: string) => {
  const res = await api.post('/applications', { unitId })
  return res.data
}

