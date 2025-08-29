import api from '@/api/axios'
import type { AdminUser } from '@/context/admin/authContext'

export const institutionAdminLogin = async (
  email: string,
  password: string
): Promise<AdminUser | null> => {
  try {
    const response = await api.post('/admin/auth/login', { email, password })
    if (response.data.status === 200) {
      localStorage.setItem('accessToken', response.data.access_token)
      const user: AdminUser = {
        userId: '',
        email,
        password: '',
        role: 'INSTITUTION_ADMIN',
      }
      return user
    }
    return null
  } catch (error) {
    throw error
  }
}

export const getInstitutionDashboard = async (): Promise<{ units: number; students: number; applications: number }> => {
  const response = await api.get('/admin/dashboard')
  return response.data.data
}

export interface InstitutionAdminProfile {
  adminId: string;
  email: string;
  role: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  institutionId?: string | null;
}

export const getInstitutionAdminProfile = async (): Promise<InstitutionAdminProfile> => {
  const response = await api.get('/admin/profile')
  return response.data.profile as InstitutionAdminProfile
}

