// uniform-frontend/src/types/admin.ts

export interface Institution {
  institutionId: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  establishedYear?: number;
  logoUrl?: string;
  ownership?: 'PUBLIC' | 'PRIVATE' | null;
  type?: 'GENERAL' | 'ENGINEERING' | null;
  createdAt: string;
  updatedAt: string;
  institutionCategoryInstitutionCategoryId?: string;
}

export interface Admin {
  adminId: string;
  email: string;
  role: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  institutionId?: string;
  institution?: Institution;
}

export interface DashboardStats {
  totalInstitutions: number;
  totalUnits: number;
  totalStudents: number;
  totalApplications: number;
  applicationTrend: 'up' | 'down' | 'stable';
}

export interface RecentActivity {
  id: string;
  type: 'institution' | 'admin';
  title: string;
  timestamp: string;
  details?: string;
}

export interface SystemAdmin {
  systemAdminId: string;
  email: string;
  role: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: SystemAdmin;
}

export interface InstitutionCategory {
  institutionCategoryId: string;
  name: string;
  description?: string;
}

export interface Institution {
  institutionId: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  establishedYear?: number;
  logoUrl?: string;
  ownership?: 'PUBLIC' | 'PRIVATE' | null;
  type?: 'GENERAL' | 'ENGINEERING' | null;
  createdAt: string;
  updatedAt: string;
  InstitutionCategory?: {
    institutionCategoryId: string;
    name: string;
    description?: string | null;
  } | null;
}
