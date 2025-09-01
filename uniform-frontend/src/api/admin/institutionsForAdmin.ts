// uniform-frontend/src/api/admin/institutionsForAdmin.ts
import api from "@/api/axios";

// Create and assign a new institution admin
export const createAndAssignAdmin = async (adminData: {
  email: string;
  password: string;
  institutionId: string;
}) => {
  const response = await api.post("/system/admins/create-and-assign", adminData);
  return response.data;
};

// Unassign an institution admin
export const unassignAdmin = async (adminId: string) => {
  const response = await api.patch(`/system/admins/${adminId}/unassign-institution`);
  return response.data;
};

// Fetch all institutions
export const getInstitutions = async () => {
  const response = await api.get("/system/institutions");
  return response.data;
};

// Create a new institution
export const createInstitution = async (institutionData: {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  establishedYear?: number;
  institutionCategoryId?: string;
}) => {
  const response = await api.post("/system/institutions", institutionData);
  return response.data;
};

// Delete an institution
export const deleteInstitution = async (institutionId: string) => {
  const response = await api.delete(`/system/institutions/${institutionId}`);
  return response.data;
};