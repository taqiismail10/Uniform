// uniform-frontend/src/api/admin/adminApi.ts

import api from '@/api/axios';
import type { Institution, Admin, LoginResponse, SystemAdmin } from '@/types/admin';

export const adminApi = {
  // Auth
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/system/auth/login', { email, password });
    return response.data;
  },

  // Profile
  getProfile: async (): Promise<SystemAdmin> => {
    const response = await api.get('/system/admins/profile');
    return response.data.profile;
  },

  // Institutions
  getInstitutions: async (): Promise<{ institutions: Institution[] }> => {
    const response = await api.get('/system/institutions');
    return response.data;
  },

  createInstitution: async (
    institutionData: {
      name: string;
      description?: string;
      address?: string;
      phone?: string;
      email?: string;
      website?: string;
      establishedYear?: number;
      logoUrl?: string;
      categoryName?: string;
    }
  ): Promise<Institution> => {
    const response = await api.post('/system/institutions', institutionData);
    return response.data;
  },

  deleteInstitution: async (institutionId: string): Promise<void> => {
    await api.delete(`/system/institutions/${institutionId}`);
  },

  getInstitutionById: async (institutionId: string): Promise<Institution> => {
    const response = await api.get(`/system/institutions/${institutionId}`);
    return response.data.institution;
  },

  updateInstitution: async (
    institutionId: string,
    data: {
      name: string;
      description?: string;
      address?: string;
      phone?: string;
      email?: string;
      website?: string;
      establishedYear?: number;
      logoUrl?: string;
      categoryName?: string;
    }
  ): Promise<Institution> => {
    const response = await api.put(`/system/institutions/${institutionId}`, data);
    return response.data.institution;
  },

  // Admins
  createAdmin: async (adminData: { email: string; password: string; institutionId?: string }): Promise<Admin> => {
    const response = await api.post('/system/admins/create-and-assign', adminData);
    return response.data;
  },

  unassignAdmin: async (adminId: string): Promise<void> => {
    await api.patch(`/system/admins/${adminId}/unassign-institution`);
  },
};
