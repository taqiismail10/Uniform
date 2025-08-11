// uniform-frontend/src/api/index.ts

import axios from "axios";
import type { User } from "@/context/AuthContext";
import type { Institution, AcademicInfo, Document, Application, UserData } from "@/components/student/types";

const API_URL = "http://localhost:5000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      config.headers.Authorization = `Bearer ${user.userId}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Register User
export const registerUser = async (userData: Omit<User, 'userId'>): Promise<User | null> => {
  try {
    const response = await api.post<User>('/users', userData);
    return response.data;
  } catch (error) {
    console.error("Registration Failed:", error);
    return null;
  }
};

// Login User
export const userLogin = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await api.get<User[]>('/users', {
      params: { email, password }
    });
    return response.data[0] || null;
  } catch (error) {
    console.error("Login Failed:", error);
    return null;
  }
};

// Get Institutions
export const getInstitutions = async (): Promise<Institution[]> => {
  try {
    const response = await api.get<Institution[]>('/institutions');
    return response.data;
  } catch (error) {
    console.error("Get Institutions Failed:", error);
    return [];
  }
};

// Get Academic Info by User ID
export const getAcademicInfo = async (userId: string): Promise<AcademicInfo | null> => {
  try {
    const response = await api.get<AcademicInfo[]>('/academicInfo', {
      params: { userId }
    });
    return response.data[0] || null;
  } catch (error) {
    console.error("Get Academic Info Failed:", error);
    return null;
  }
};

// Create or Update Academic Info
export const saveAcademicInfo = async (academicInfo: AcademicInfo): Promise<AcademicInfo | null> => {
  try {
    // Remove id if it's undefined (for new records)
    const { id, ...data } = academicInfo;

    if (id) {
      // Update existing
      const response = await api.put<AcademicInfo>(`/academicInfo/${id}`, data);
      return response.data;
    } else {
      // Create new
      const response = await api.post<AcademicInfo>('/academicInfo', data);
      return response.data;
    }
  } catch (error) {
    console.error("Save Academic Info Failed:", error);
    return null;
  }
};

// Get Documents by User ID
export const getDocuments = async (userId: string): Promise<Document[]> => {
  try {
    const response = await api.get<Document[]>('/documents', {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error("Get Documents Failed:", error);
    return [];
  }
};

// Upload Document
export const uploadDocument = async (document: Omit<Document, 'id'>): Promise<Document | null> => {
  try {
    const response = await api.post<Document>('/documents', document);
    return response.data;
  } catch (error) {
    console.error("Upload Document Failed:", error);
    return null;
  }
};

// Delete Document
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    await api.delete(`/documents/${documentId}`);
    return true;
  } catch (error) {
    console.error("Delete Document Failed:", error);
    return false;
  }
};

// Get Applications by User ID
export const getApplications = async (userId: string): Promise<Application[]> => {
  try {
    const response = await api.get<Application[]>('/applications', {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error("Get Applications Failed:", error);
    return [];
  }
};

// Submit Application
export const submitApplication = async (application: Omit<Application, 'id'>): Promise<Application | null> => {
  try {
    const response = await api.post<Application>('/applications', application);
    return response.data;
  } catch (error) {
    console.error("Submit Application Failed:", error);
    return null;
  }
};

// Update Application Status
export const updateApplicationStatus = async (
  applicationId: string,
  status: Application['status']
): Promise<Application | null> => {
  try {
    const response = await api.patch<Application>(`/applications/${applicationId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Update Application Status Failed:", error);
    return null;
  }
};

// Get Institution by ID
export const getInstitutionById = async (institutionId: string): Promise<Institution | null> => {
  try {
    const response = await api.get<Institution>(`/institutions/${institutionId}`);
    return response.data;
  } catch (error) {
    console.error("Get Institution Failed:", error);
    return null;
  }
};

// Get User by ID
export const getUserById = async (userId: string): Promise<UserData | null> => {
  try {
    const response = await api.get<UserData>(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get User Failed:", error);
    return null;
  }
};

// Update User Profile
export const updateUserProfile = async (
  userId: string,
  userData: Partial<UserData>
): Promise<UserData | null> => {
  try {
    const response = await api.patch<UserData>(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Update User Profile Failed:", error);
    return null;
  }
};